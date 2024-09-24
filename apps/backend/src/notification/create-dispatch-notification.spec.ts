import { ExpressWithPortAndSocket } from "@/create-server-side-web-socket";
import http from "http";
import { generateKeyPair } from "jose";
import { last, pipe, split } from "ramda";
import { io as ioc, Socket } from "socket.io-client";
import { appFactory } from "../app";
import TestFixture from "../test-fixture";
import createDispatchNotification from "./create-dispatch-notification";

let httpServer: http.Server;
let app: ExpressWithPortAndSocket;
let testFixture: TestFixture;
let resolvePromiseWhenUserJoinsRoom = (value: unknown) => {};
let dispatchNotification;

beforeEach(async () => {
  const jwtKeyPair = await generateKeyPair("RS256");

  app = appFactory({
    stage: "test",
    keys: { jwtKeyPair: jwtKeyPair },
    publishInternalEvent: (payload) => Promise.resolve(),
  });

  dispatchNotification = createDispatchNotification(app.server);
  testFixture = new TestFixture(app);
});
describe(`create-dispatch-notification`, () => {
  describe(`given a user connected to a socket`, () => {
    describe(`and no other users are connected`, () => {
      describe(`when a message is dispatched to the user`, () => {
        let recipientSocket: Socket;
        afterEach(() => {
          recipientSocket.removeAllListeners();
          recipientSocket.disconnect();
        });
        it(`the user receives the message`, async () => {
          const singleUserPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });
          let resolveUserPromise: (value: unknown) => void;
          const loginResponse =
            await testFixture.signUpAndLoginEmailResponse("poorguy@email.com");

          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = loginResponse;

          const token = pipe(split(" "), last)(authorization);

          recipientSocket = ioc(uri, {
            auth: {
              token,
            },
          });

          const userPromise = new Promise((resolve) => {
            resolveUserPromise = resolve;
          });

          recipientSocket.connect();
          recipientSocket
            .on("example_event", (details) => {
              resolveUserPromise(details);
              recipientSocket.disconnect();
            })
            .on("connection_established", () => {
              resolvePromiseWhenUserJoinsRoom("testData");
            });

          await singleUserPromise;

          dispatchNotification({
            recipient: "poorguy@email.com",
            type: "example_event",
            payload: {
              exampleData: "FirstTest!",
            },
          });

          return expect(userPromise).resolves.toEqual({
            exampleData: "FirstTest!",
          });
        });
      });
      describe("when multiple messages are dispatched to the user", () => {
        let recipientSocket: Socket;
        afterEach(() => {
          recipientSocket.removeAllListeners();
          recipientSocket.disconnect();
        });
        it("the user receives all messages", async () => {
          const singleUserPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });
          let resolveUserReceivesMessagesPromise: (value: unknown) => void;
          const loginResponse =
            await testFixture.signUpAndLoginEmailResponse("poorguy@email.com");

          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = loginResponse;

          const token = pipe(split(" "), last)(authorization);

          recipientSocket = ioc(uri, {
            auth: {
              token,
            },
          });

          const userReceivesMessagesPromise = new Promise((resolve) => {
            resolveUserReceivesMessagesPromise = resolve;
          });

          recipientSocket.connect();
          const messages = [];
          let messagesReceived = 0;
          recipientSocket
            .on("example_event", (details) => {
              messagesReceived++;
              messages.push(details);
              if (messagesReceived == 2) {
                resolveUserReceivesMessagesPromise(messages);
              }
            })
            .on("connection_established", () => {
              resolvePromiseWhenUserJoinsRoom("testData");
            });

          await singleUserPromise;

          dispatchNotification({
            recipient: "poorguy@email.com",
            type: "example_event",
            payload: {
              exampleData: "FirstNotification!",
            },
          });

          dispatchNotification({
            recipient: "poorguy@email.com",
            type: "example_event",
            payload: {
              exampleData: "SecondNotification!",
            },
          });

          await expect(userReceivesMessagesPromise).resolves.toEqual([
            {
              exampleData: "FirstNotification!",
            },
            {
              exampleData: "SecondNotification!",
            },
          ]);
        });
      });
    });
    describe(`and another user is connected`, () => {
      describe(`when a message is dispatched to another user`, () => {
        let inviteeSocket: Socket;
        let thirdPartySocket: Socket;

        afterEach(() => {
          thirdPartySocket.removeAllListeners();
          thirdPartySocket.disconnect();
          inviteeSocket.removeAllListeners();
          inviteeSocket.disconnect();
        });
        it("only sends the message to the intended recipient", async () => {
          const firstUserConnectionPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });

          let resolveInviteeEventPromise: (value: unknown) => void;

          const promiseToResolveWhenInviteeReceivesEvent = new Promise(
            (resolve) => {
              resolveInviteeEventPromise = resolve;
            },
          );
          const inviteeResponse =
            await testFixture.signUpAndLoginEmailResponse("invitee@email.com");
          const thirdPartyAuth = await testFixture.signUpAndLoginEmail(
            "thirdParty@email.com",
          );

          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = inviteeResponse;

          const thirdPartyToken = pipe(split(" "), last)(thirdPartyAuth);
          const inviteeToken = pipe(split(" "), last)(authorization);

          thirdPartySocket = ioc(uri, {
            auth: {
              token: thirdPartyToken,
            },
          });

          inviteeSocket = ioc(uri, {
            auth: {
              token: inviteeToken,
            },
          });

          thirdPartySocket
            .on("example_event", (details) => {
              expect(true).toBeFalsy();
            })
            .on("connection_established", () => {
              resolvePromiseWhenUserJoinsRoom("testData");
            });

          await firstUserConnectionPromise;

          const secondUserConnectionPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });

          inviteeSocket
            .on("example_event", (details) => {
              resolveInviteeEventPromise(details);
            })
            .on("connection_established", () => {
              resolvePromiseWhenUserJoinsRoom("testData");
            });

          await secondUserConnectionPromise;

          dispatchNotification({
            recipient: "invitee@email.com",
            type: "example_event",
            payload: {
              exampleData: "SecondTest!",
            },
          });

          await expect(
            promiseToResolveWhenInviteeReceivesEvent,
          ).resolves.toEqual({
            exampleData: "SecondTest!",
          });
        });
      });
      describe(`when a message is dispatched to each user`, () => {
        let firstUserSocket: Socket;
        let secondUserSocket: Socket;

        afterEach(() => {
          firstUserSocket.removeAllListeners();
          secondUserSocket.removeAllListeners();
          firstUserSocket.disconnect();
          secondUserSocket.disconnect();
        });
        it(`each user receives a message`, async () => {
          let resolveFirstUserEventPromise: (value: unknown) => void;
          let resolveSecondUserEventPromise: (value: unknown) => void;
          let resolveSecondWhenUserJoins;
          let resolveFirstWhenUserJoins;

          const firstUserConnectionPromise = new Promise((resolve) => {
            resolveFirstWhenUserJoins = resolve;
          });
          const secondUserConnectionPromise = new Promise((resolve) => {
            resolveSecondWhenUserJoins = resolve;
          });

          const promiseToResolveWhenFirstUserReceivesEvent = new Promise(
            (resolve) => {
              resolveFirstUserEventPromise = resolve;
            },
          );
          const promiseToResolveWhenSecondUserReceivesEvent = new Promise(
            (resolve) => {
              resolveSecondUserEventPromise = resolve;
            },
          );

          const firstUserResponse =
            await testFixture.signUpAndLoginEmailResponse(
              "firstUser@email.com",
            );
          const secondUserAuth = await testFixture.signUpAndLoginEmail(
            "secondUser@email.com",
          );

          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = firstUserResponse;

          const firstUserToken = pipe(split(" "), last)(authorization);
          const secondUserToken = pipe(split(" "), last)(secondUserAuth);

          firstUserSocket = ioc(uri, {
            auth: {
              token: firstUserToken,
            },
          });

          secondUserSocket = ioc(uri, {
            auth: {
              token: secondUserToken,
            },
          });

          firstUserSocket
            .on("example_event", (details) => {
              resolveFirstUserEventPromise(details);
            })
            .on("connection_established", () => {
              resolveFirstWhenUserJoins();
            });
          await firstUserConnectionPromise;

          secondUserSocket
            .on("example_event", (details) => {
              resolveSecondUserEventPromise(details);
            })
            .on("connection_established", () => {
              resolveSecondWhenUserJoins();
            });
          await secondUserConnectionPromise;

          dispatchNotification({
            recipient: "firstUser@email.com",
            type: "example_event",
            payload: {
              exampleData: "firstUser!",
            },
          });

          dispatchNotification({
            recipient: "secondUser@email.com",
            type: "example_event",
            payload: {
              exampleData: "secondUser!",
            },
          });

          await expect(
            promiseToResolveWhenFirstUserReceivesEvent,
          ).resolves.toEqual({
            exampleData: "firstUser!",
          });

          await expect(
            promiseToResolveWhenSecondUserReceivesEvent,
          ).resolves.toEqual({
            exampleData: "secondUser!",
          });
        });
      });
    });
    describe(`and a message is dispatched to a non-existent recipient`, () => {
      describe(`when a message is dispatched to the user`, () => {
        it(`only the user receives a message`, async () => {
          const singleUserPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });
          let resolveUserPromise: (value: unknown) => void;
          const inviteeResponse =
            await testFixture.signUpAndLoginEmailResponse("poorguy@email.com");
          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = inviteeResponse;

          const token = pipe(split(" "), last)(authorization);

          const recipientSocket = ioc(uri, {
            auth: {
              token,
            },
          });

          const userPromise = new Promise((resolve) => {
            resolveUserPromise = resolve;
          });

          recipientSocket
            .on("example_event", (details) => {
              resolveUserPromise(details);
              recipientSocket.disconnect();
            })
            .on("connection_established", () => {
              resolvePromiseWhenUserJoinsRoom("aaa");
            });

          await singleUserPromise;

          dispatchNotification({
            recipient: "nonExistingUser@email.com",
            type: "example_event",
            payload: {
              exampleData: "shouldNotSeeThis!",
            },
          });

          dispatchNotification({
            recipient: "poorguy@email.com",
            type: "example_event",
            payload: {
              message: "Great Success!",
            },
          });

          await expect(userPromise).resolves.toEqual({
            message: "Great Success!",
          });
        });
      });
    });
  });
});

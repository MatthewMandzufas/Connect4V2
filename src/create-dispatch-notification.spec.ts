import { Express } from "express";
import http from "http";
import { generateKeyPair, jwtDecrypt } from "jose";
import { AddressInfo } from "net";
import { last, pipe, split } from "ramda";
import { Server } from "socket.io";
import { io as ioc, Socket } from "socket.io-client";
import { appFactory } from "./app";
import createDispatchNotification from "./create-dispatch-notification";
import TestFixture from "./test-fixture";

let httpServer: http.Server;
let server: Server;
let app: Express;
let connectionAddress: string;
let testFixture: TestFixture;
let resolvePromiseWhenUserJoinsRoom = (value: unknown) => {};

beforeEach(async () => {
  const jwtKeyPair = generateKeyPair("RS256");
  app = appFactory({
    stage: "test",
    keys: { jwtKeyPair: await jwtKeyPair },
    publishEvent: (queue, payload) => Promise.resolve(),
  });

  testFixture = new TestFixture(app);
  httpServer = http.createServer(app);
  server = new Server(httpServer);

  httpServer.listen(() => {
    const port = (httpServer.address() as AddressInfo).port;
    connectionAddress = `http://localhost:${port}`;
  });
  server.on("connection", async (socket) => {
    const token = socket.handshake.auth.token;

    const { privateKey } = await jwtKeyPair;
    const {
      payload: { userName },
    } = await jwtDecrypt(token, privateKey);
    resolvePromiseWhenUserJoinsRoom("dummyValue");
    socket.join(userName as string);
  });
});

afterEach(() => {
  httpServer.removeAllListeners();
  httpServer.close();
  server.removeAllListeners();
  server.close();
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
          const inviteeAuth = await testFixture.signUpAndLoginEmail(
            "poorguy@email.com"
          );
          const token = pipe(split(" "), last)(inviteeAuth);

          recipientSocket = ioc(connectionAddress, {
            auth: {
              token,
            },
          });

          const userPromise = new Promise((resolve) => {
            resolveUserPromise = resolve;
          });

          recipientSocket.connect();
          recipientSocket.on("example_event", (details) => {
            resolveUserPromise(details);
            recipientSocket.disconnect();
          });

          await singleUserPromise;
          const dispatchNotification = createDispatchNotification(server);

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
          const inviteeAuth = await testFixture.signUpAndLoginEmail(
            "poorguy@email.com"
          );
          const token = pipe(split(" "), last)(inviteeAuth);

          recipientSocket = ioc(connectionAddress, {
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
          recipientSocket.on("example_event", (details) => {
            messagesReceived++;
            messages.push(details);
            if (messagesReceived == 2) {
              resolveUserReceivesMessagesPromise(messages);
            }
          });

          await singleUserPromise;
          const dispatchNotification = createDispatchNotification(server);

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
            }
          );
          const inviteeAuth = await testFixture.signUpAndLoginEmail(
            "invitee@email.com"
          );
          const thirdPartyAuth = await testFixture.signUpAndLoginEmail(
            "thirdParty@email.com"
          );
          const thirdPartyToken = pipe(split(" "), last)(thirdPartyAuth);
          const inviteeToken = pipe(split(" "), last)(inviteeAuth);

          thirdPartySocket = ioc(connectionAddress, {
            auth: {
              token: thirdPartyToken,
            },
          });

          await firstUserConnectionPromise;

          inviteeSocket = ioc(connectionAddress, {
            auth: {
              token: inviteeToken,
            },
          });

          thirdPartySocket.on("example_event", (details) => {
            expect(true).toBeFalsy();
          });

          const secondUserConnectionPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });

          inviteeSocket.on("example_event", (details) => {
            resolveInviteeEventPromise(details);
          });
          await secondUserConnectionPromise;

          const dispatchNotification = createDispatchNotification(server);
          dispatchNotification({
            recipient: "invitee@email.com",
            type: "example_event",
            payload: {
              exampleData: "SecondTest!",
            },
          });

          await expect(
            promiseToResolveWhenInviteeReceivesEvent
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
          const firstUserConnectionPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });

          let resolveFirstUserEventPromise: (value: unknown) => void;
          let resolveSecondUserEventPromise: (value: unknown) => void;

          const promiseToResolveWhenFirstUserReceivesEvent = new Promise(
            (resolve) => {
              resolveFirstUserEventPromise = resolve;
            }
          );

          const promiseToResolveWhenSecondUserReceivesEvent = new Promise(
            (resolve) => {
              resolveSecondUserEventPromise = resolve;
            }
          );
          const firstUserAuth = await testFixture.signUpAndLoginEmail(
            "firstUser@email.com"
          );
          const secondUserAuth = await testFixture.signUpAndLoginEmail(
            "secondUser@email.com"
          );
          const firstUserToken = pipe(split(" "), last)(firstUserAuth);
          const secondUserToken = pipe(split(" "), last)(secondUserAuth);

          firstUserSocket = ioc(connectionAddress, {
            auth: {
              token: firstUserToken,
            },
          });

          secondUserSocket = ioc(connectionAddress, {
            auth: {
              token: secondUserToken,
            },
          });
          await firstUserConnectionPromise;

          secondUserSocket.on("example_event", (details) => {
            resolveSecondUserEventPromise(details);
          });

          const secondUserConnectionPromise = new Promise((resolve) => {
            resolvePromiseWhenUserJoinsRoom = resolve;
          });

          await secondUserConnectionPromise;
          firstUserSocket.on("example_event", (details) => {
            resolveFirstUserEventPromise(details);
          });

          const dispatchNotification = createDispatchNotification(server);
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
            promiseToResolveWhenFirstUserReceivesEvent
          ).resolves.toEqual({
            exampleData: "firstUser!",
          });

          await expect(
            promiseToResolveWhenSecondUserReceivesEvent
          ).resolves.toEqual({
            exampleData: "secondUser!",
          });
        });
      });
    });
  });
});

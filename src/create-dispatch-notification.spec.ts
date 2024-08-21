import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc, Socket } from "socket.io-client";
import { appFactory } from "./app";
import createDispatchNotification from "./create-dispatch-notification";
import TestFixture from "./test-fixture";

let httpServer: http.Server;
let server: Server;
let app: Express;
let connectionAddress: string;
let testFixture: TestFixture;
let serverSocket: Promise<ServerSocket>;
let resolveServerSocket: (socket: ServerSocket) => void;

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
  serverSocket = new Promise((resolve) => {
    resolveServerSocket = resolve;
  });
  httpServer.listen(() => {
    const port = (httpServer.address() as AddressInfo).port;
    connectionAddress = `http://localhost:${port}`;
  });
  server.on("connection", resolveServerSocket);
});

afterEach(() => {
  httpServer.close();
  httpServer.removeAllListeners();
  server.close();
});

describe(`create-dispatch-notification`, () => {
  describe(`given a user connected to a socket`, () => {
    describe(`when a message is dispatched to the user`, () => {
      it(`the user receives the message`, async () => {
        let resolveUserPromise: (value: unknown) => void;
        const inviteeAuth = await testFixture.signUpAndLoginEmail(
          "poorguy@email.com"
        );

        const recipientSocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: inviteeAuth,
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

        const dispatchNotification = createDispatchNotification(
          await serverSocket
        );

        dispatchNotification({
          recipient: "poorguy@email.com",
          type: "example_event",
          payload: {
            exampleData: "Hello!",
          },
        });

        return expect(userPromise).resolves.toEqual({
          exampleData: "Hello!",
        });
      });
    });
    describe(`when a message is dispatched to another user`, () => {
      let inviteeSocket: Socket;
      let thirdPartySocket: Socket;

      afterEach(() => {
        inviteeSocket.disconnect();
        thirdPartySocket.disconnect();
      });
      it("only sends the message to the intended recipient", async () => {
        let resolveUserPromise: (value: unknown) => void;

        const inviteeAuth = await testFixture.signUpAndLoginEmail(
          "invitee@email.com"
        );
        const ThirdPartyAuth = await testFixture.signUpAndLoginEmail(
          "random@email.com"
        );

        thirdPartySocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: ThirdPartyAuth,
          },
        });

        inviteeSocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: inviteeAuth,
          },
        });
        const userPromise = new Promise((resolve) => {
          resolveUserPromise = resolve;
        });

        thirdPartySocket.connect();
        thirdPartySocket.on("example_event", (details) => {
          expect(true).toBeFalsy();
        });

        inviteeSocket.connect();
        inviteeSocket.on("example_event", (details) => {
          resolveUserPromise(details);
        });

        const dispatchNotification = createDispatchNotification(
          await serverSocket
        );

        dispatchNotification({
          recipient: "invitee@email.com",
          type: "example_event",
          payload: {
            exampleData: "Hello!",
          },
        });

        await expect(userPromise).resolves.toEqual({
          exampleData: "Hello!",
        });
      });
    });
  });
});

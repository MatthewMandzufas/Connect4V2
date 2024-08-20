import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc } from "socket.io-client";
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
});

beforeAll(async () => {
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
  });
});

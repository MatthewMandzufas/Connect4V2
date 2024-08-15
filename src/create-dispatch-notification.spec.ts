import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";
import { appFactory } from "./app";
import TestFixture from "./test-fixture";

let httpServer: http.Server;
let server: Server;
let app: Express;
let connectionAddress: string;

beforeEach(async () => {
  const jwtKeyPair = generateKeyPair("RS256");
  app = appFactory({
    stage: "test",
    keys: { jwtKeyPair: await jwtKeyPair },
    publishEvent: (queue, payload) => Promise.resolve(),
  });
});

beforeAll(async () => {
  httpServer = http.createServer(app);
  server = new Server(httpServer);
  httpServer.listen(() => {
    const port = (httpServer.address() as AddressInfo).port;
    connectionAddress = `http://localhost:${port}`;
  });
});

describe(`create-dispatch-notification`, () => {
  describe(`given a user connected to a socket`, () => {
    describe(`when a message is dispatched to the user`, () => {
      it(`the user receives the message`, async () => {
        let userResolvePromise;
        const testFixture = new TestFixture();
        const inviteeAuth = await testFixture.signUpAndLoginEmail(
          "poorguy@email.com"
        );

        const recipientSocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: inviteeAuth,
          },
        });

        recipientSocket.connect();
        recipientSocket.on("EVENT_RECEIVED", (details) => {
          userResolvePromise(details);
          recipientSocket.disconnect();
        });

        const dispatchNotification = new createDispatchNotification(
          recipientSocket
        );
        dispatchNotification({ recipient: "poorguy@email.com", payload: {} });

        return expect(userResolvePromise).resolves.toEqual({
          recipient: "poorguy@email.com",
          payload: {},
        });
      });
    });
  });
});

import { appFactory } from "@/app";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { last, pipe, split } from "ramda";
import { Server, type Socket as ServerSocket } from "socket.io";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { InviteReceivedMessage } from "./invite-notification-integration.d";
import { InviteStatus } from "./invite-service.d";

describe(`invite-notification-integration.ts`, () => {
  const jwtKeyPair = generateKeyPair("RS256");

  let app: Express;
  let io: Server;
  let clientSocket: ClientSocket;
  let serverSocket: ServerSocket;

  beforeAll((done) => {
    jwtKeyPair.then((jwtKeyPair) => {
      app = appFactory({
        stage: "test",
        keys: { jwtKeyPair },
      });

      const httpServer = http.createServer(app);
      io = new Server(httpServer);

      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  describe(`given a user is logged in`, () => {
    describe(`when another user sends them an invite`, () => {
      it(`they receive a new notification`, async () => {
        let resolveInviteDetailsReceivedPromise;
        const inviteDetailsReceivedPromise = new Promise(
          (resolve) => (resolveInviteDetailsReceivedPromise = resolve)
        );
        expect.assertions(1);
        const testFixture = new TestFixture(app);

        const inviteeAuthField = await testFixture.signUpAndLoginEmail(
          "2@email.com"
        );
        const inviterAuthField = await testFixture.signUpAndLoginEmail(
          "1@email.com"
        );

        const token = pipe(split(" "), last)(inviteeAuthField);
        ioc("ws://localhost", {
          auth: {
            token,
          },
        });

        clientSocket.connect();
        clientSocket.on(
          "invite_received",
          (inviteReceivedMessage: InviteReceivedMessage) => {
            resolveInviteDetailsReceivedPromise(inviteReceivedMessage);
            clientSocket.disconnect();
            clientSocket.close();
          }
        );

        testFixture.sendInvite({
          inviter: "1@email.com",
          invitee: "2@email.com",
          authField: inviterAuthField,
        });
        return expect(inviteDetailsReceivedPromise).resolves.toEqual({
          inviter: "1@email.com",
          invitee: "2@email.com",
          exp: expect.any(Number),
          uuid: expect.toBeUUID(),
          status: InviteStatus.PENDING,
        });
      });
    });
  });
});

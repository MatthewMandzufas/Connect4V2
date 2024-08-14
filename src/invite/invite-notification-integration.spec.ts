import { appFactory } from "@/app";
import TestFixture from "@/test-fixture";
import {
  RabbitMQContainer,
  StartedRabbitMQContainer,
} from "@testcontainers/rabbitmq";
import amqp, { Channel, Connection } from "amqplib";
import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";
import { InviteReceivedMessage } from "./invite-notification-integration.d";
import { InviteDetails, InviteStatus } from "./invite-service.d";

describe(`invite-notification-integration.ts`, () => {
  let app: Express;
  let httpServer: http.Server;
  let server: Server;
  let connectionAddress: string;
  let rabbitMQContainer: StartedRabbitMQContainer;
  let connection: Connection;
  let channel: Channel;
  let fixture: TestFixture;

  beforeAll(async () => {
    const jwtKeyPair = generateKeyPair("RS256");
    rabbitMQContainer = await new RabbitMQContainer().start();
    connection = await amqp.connect(rabbitMQContainer.getAmqpUrl());
    channel = await connection.createChannel();
    app = appFactory({
      stage: "test",
      keys: { jwtKeyPair: await jwtKeyPair },
      publishEvent: (queue, content: InviteDetails) =>
        Promise.resolve(
          channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(content, null, 2))
          )
        ),
    });
    const q = await channel.assertQueue("invite_created", { durable: false });
    fixture = new TestFixture(app);
    httpServer = http.createServer(app);
    server = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      connectionAddress = `http://localhost:${port}`;
      server.on("connection", async (socket) => {
        await channel.prefetch(1);
        channel.consume(q.queue, (msg) => {
          const parsedContent = JSON.parse(msg.content as unknown as string);
          socket.emit("invite_received", parsedContent);
        });
      });
    });
  }, 1000000);

  afterAll(async () => {
    server.close();
    httpServer.close();
    await channel
      .close()
      .then(() => connection.close())
      .then(() => rabbitMQContainer.stop());
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

        const clientSocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: inviteeAuthField,
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
    describe("when an inviter sends an invite to an invitee who is not the user", () => {
      it.skip("the user does not receive a notification", async () => {
        let resolveInviteDetailsReceivedPromise: (value: unknown) => void;
        const mockedHandleInviteReceivedByThirdParty = jest.fn();
        const inviterAuth = await fixture.signUpAndLoginEmail(
          "inviter@email.com"
        );
        const inviteeAuth = await fixture.signUpAndLoginEmail(
          "invitee@email.com"
        );
        const thirdPartyAuth = await fixture.signUpAndLoginEmail(
          "thirdParty@email.com"
        );

        const thirdPartySocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: thirdPartyAuth,
          },
        });
        const inviteDetailsReceivedPromise = new Promise((resolve) => {
          resolveInviteDetailsReceivedPromise = resolve;
          expect(mockedHandleInviteReceivedByThirdParty).not.toHaveBeenCalled();
          thirdPartySocket.disconnect();
          thirdPartySocket.close();
        });

        await fixture.sendInviteEmails({
          inviter: "inviter@email.com",
          invitee: "invitee@email.com",
        });

        const inviteeSocket = ioc(connectionAddress, {
          extraHeaders: {
            Authorization: inviteeAuth,
          },
        });
        inviteeSocket.connect();
        inviteeSocket.on("invite_received", (inviteDetails) => {
          resolveInviteDetailsReceivedPromise(inviteDetails);
          inviteeSocket.disconnect();
          inviteeSocket.close();
        });
        thirdPartySocket.on("invite_received", () => {
          mockedHandleInviteReceivedByThirdParty();
          throw new Error();
        });

        await fixture.sendInviteEmails({
          inviter: "inviter@email.com",
          invitee: "invitee@email.com",
        });
        return inviteDetailsReceivedPromise;
      });
    });
  });
});

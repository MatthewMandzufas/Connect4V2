import { appFactory } from "@/app";
import { InternalEventPublisher } from "@/global";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import { generateKeyPair } from "jose";
import { last, pipe, split } from "ramda";
import { Subject } from "rxjs";
import { io as ioc, Socket } from "socket.io-client";
import { InviteCreatedEvent } from "./create-invite-event-listener";
import { InviteReceivedMessage } from "./invite-notification-integration";
import { InviteStatus } from "./invite-service.d";

describe(`invite-notification-integration.ts`, () => {
  let app: Express;
  let testFixture: TestFixture;
  let publishInternalEvent: InternalEventPublisher<any, any>;

  beforeAll(async () => {
    const jwtKeyPair = await generateKeyPair("RS256");
    publishInternalEvent = jest.fn((eventDetails: InviteCreatedEvent) => {
      return Promise.resolve(messageSubject.next(eventDetails));
    });
    const messageSubject = new Subject<InviteCreatedEvent>();
    app = appFactory({
      stage: "test",
      keys: { jwtKeyPair: jwtKeyPair },
      publishInternalEvent,
      internalEventSubscriber: messageSubject,
    });
    testFixture = new TestFixture(app);
  });

  describe(`given a user is logged in`, () => {
    describe(`and subscribed to notifications`, () => {
      let clientSocket: Socket;
      beforeEach(async () => {
        let resolveUserConnectedPromise: (value: unknown) => void;

        const userConnectedPromise = new Promise(
          (resolve) => (resolveUserConnectedPromise = resolve),
        );

        const inviteeResponse =
          await testFixture.signUpAndLoginEmailResponse("2@email.com");

        const {
          body: {
            notification: { uri },
          },
          headers: { authorization },
        } = inviteeResponse;

        const inviteeToken = pipe(split(" "), last)(authorization);

        clientSocket = ioc(uri, {
          auth: {
            token: inviteeToken,
          },
        });

        clientSocket.on("connection_established", () => {
          resolveUserConnectedPromise("foo");
        });

        await userConnectedPromise;
      });
      describe(`when another user sends them an invite`, () => {
        it(`they receive the invite notification`, async () => {
          expect.assertions(2);

          let resolveInviteDetailsReceivedPromise: (value: unknown) => void;

          const inviteDetailsReceivedPromise = new Promise(
            (resolve) => (resolveInviteDetailsReceivedPromise = resolve),
          );

          const inviterAuthField =
            await testFixture.signUpAndLoginEmail("1@email.com");

          clientSocket.on(
            "invite_received",
            (inviteReceivedMessage: InviteReceivedMessage) => {
              resolveInviteDetailsReceivedPromise(inviteReceivedMessage);
              clientSocket.disconnect();
              clientSocket.close();
            },
          );

          await testFixture.sendInvite({
            inviter: "1@email.com",
            invitee: "2@email.com",
            authField: inviterAuthField,
          });

          expect(publishInternalEvent).toHaveBeenCalledWith({
            payload: {
              exp: expect.any(Number),
              invitee: "2@email.com",
              inviter: "1@email.com",
              status: "PENDING",
              uuid: expect.toBeUUID(),
            },
            type: "INVITATION_CREATED",
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
});

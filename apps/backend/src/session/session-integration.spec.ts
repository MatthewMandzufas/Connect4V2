import { appFactory } from "@/app";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import { generateKeyPair, GenerateKeyPairResult, KeyLike } from "jose";
import { last, pipe, split } from "ramda";
import request from "supertest";

describe("session-integration", () => {
  const gameRegex = new RegExp(
    `^/game/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`
  );
  let app: Express;
  let jwtKeyPair: GenerateKeyPairResult<KeyLike>;
  let testFixture: TestFixture;
  beforeAll(async () => {
    jwtKeyPair = await generateKeyPair("RS256");
  });

  beforeEach(() => {
    app = appFactory({
      stage: "test",
      keys: {
        jwtKeyPair: {
          publicKey: jwtKeyPair.publicKey,
          privateKey: jwtKeyPair.privateKey,
        },
      },
      publishInternalEvent: (eventDetails) => Promise.resolve(),
    });
    testFixture = new TestFixture(app);
  });

  describe("retrieving a session", () => {
    describe("given a session exists", () => {
      it("retrieves the session", async () => {
        await testFixture.sendInviteEmails({
          inviter: "inviter@email.com",
          invitee: "invitee@email.com",
        });

        const inviteeResponse = await testFixture.loginUser({
          userName: "invitee@email.com",
          password: "GenericPassword",
        });

        const inviteReceivedResponse = await request(app)
          .get("/invite/inbox")
          .set("Authorization", inviteeResponse.header.authorization)
          .send();

        const acceptInviteResponse = await request(app)
          .post(inviteReceivedResponse.body.invites[0]._links.accept.href)
          .set("Authorization", inviteeResponse.header.authorization);

        const sessionUri = acceptInviteResponse.body._links.related[0].href;

        const response = await request(app)
          .get(sessionUri)
          .set("Authorization", inviteeResponse.header.authorization);

        const uuid = pipe(split("/"), last)(sessionUri);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          uuid,
          inviter: "inviter@email.com",
          invitee: "invitee@email.com",
          status: "IN_PROGRESS",
          _links: {
            self: {
              href: sessionUri,
            },
            startGame: {
              href: `/session/${uuid}/startGame`,
              method: "POST",
            },
            leave: {
              href: `${sessionUri}/leave`,
              method: "GET",
            },
          },
        });
      });
    });
  });
});

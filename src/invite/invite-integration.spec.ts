import { appFactory } from "@/app";
import { generateKeyPair } from "jose";
import request from "supertest";

describe("invite-integration", () => {
  describe("given an inviter that is an existing user", () => {
    const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;
    describe("and an invitee that is an existing user", () => {
      describe("when the inviter sends an invite to the invitee", () => {
        it("creates an invitation", async () => {
          jest.useFakeTimers({ doNotFake: ["setImmediate"] });
          const currentTime = Date.now();
          jest.setSystemTime(currentTime);
          const app = appFactory({
            stage: "test",
            keys: { jwtKeyPair: await generateKeyPair("RS256") },
          });

          const inviterUserDetails = {
            firstName: "Oscar",
            lastName: "Allen",
            email: "Oscar.Allen@email.com",
            password: "lkfksdfksdfj",
          };

          const inviteeUserDetails = {
            firstName: "Jake",
            lastName: "Waterman",
            email: "Jake.Waterman@email.com",
            password: "jsdknasknasd",
          };

          await request(app).post("/signup").send(inviterUserDetails);
          await request(app).post("/signup").send(inviteeUserDetails);
          await request(app).post("/login").send({
            userName: "Oscar.Allen@email.com",
            password: "lkfksdfksdfj",
          });

          const response = await request(app).post("/invite").send({
            invitee: "Jake.Waterman@email.com",
          });
          expect(response.statusCode).toBe(201);
          expect(response.body.invite).toEqual({
            inviter: "Oscar.Allen@email.com",
            invitee: "Jake.Waterman@email.com",
            uuid: expect.toBeUUID(),
            exp: currentTime + lengthOfDayInMilliseconds,
          });
        });
      });
    });
  });
});

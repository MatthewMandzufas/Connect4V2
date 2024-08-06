import { appFactory } from "@/app";
import { Express } from "express";
import { generateKeyPair, GenerateKeyPairResult, KeyLike } from "jose";
import request from "supertest";

describe("invite-integration", () => {
  let app: Express;
  let jwtKeyPair: GenerateKeyPairResult<KeyLike>;
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
    });
  });

  const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;
  describe("given the inviter is not logged in", () => {
    describe("when the inviter sends an invitation", () => {
      it("returns http error code 401", async () => {
        const inviteDetails = {
          invitee: "someone@email.com",
          inviter: "someoneelse@email.com",
        };
        const response = await request(app).post("/invite").send(inviteDetails);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toEqual([
          "You must be logged in to send an invitation",
        ]);
      });
    });
  });
  describe("given an inviter that is an existing user", () => {
    describe("and the inviter is logged in", () => {
      describe("and an invitee that is an existing user", () => {
        describe("when the inviter sends an invitation on behalf of another user", () => {
          it("returns https status code 401", async () => {
            const inviterUserDetails = {
              firstName: "Tyler",
              lastName: "Brockman",
              email: "Tyler.Brockman@email.com",
              password: "lkfksdfksdfj",
            };

            const inviteeUserDetails = {
              firstName: "Matt",
              lastName: "Pridis",
              email: "Matt.Pridis@email.com",
              password: "jsdknasknasd",
            };

            const thirdParty = {
              firstName: "some",
              lastName: "user",
              email: "Some.User@email.com",
              password: "jsdknasknasd",
            };

            await request(app).post("/user/signup").send(inviterUserDetails);
            await request(app).post("/user/signup").send(thirdParty);
            await request(app).post("/user/signup").send(inviteeUserDetails);
            const loginResponse = await request(app).post("/user/login").send({
              userName: "Tyler.Brockman@email.com",
              password: "lkfksdfksdfj",
            });

            const response = await request(app)
              .post("/invite")
              .set("Authorization", loginResponse.headers.authorization)
              .send({
                invitee: "Matt.Pridis@email.com",
                inviter: "Some.User@email.com",
              });
            expect(response.statusCode).toBe(403);
            expect(response.body).toEqual({
              errors: ["You must be the authorized user to send an invitation"],
            });
          });
        });
        describe("when the inviter sends an invite to the invitee", () => {
          it("creates an invitation", async () => {
            jest.useFakeTimers({ doNotFake: ["setImmediate"] });
            const currentTime = Date.now();
            jest.setSystemTime(currentTime);

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

            await request(app).post("/user/signup").send(inviterUserDetails);
            await request(app).post("/user/signup").send(inviteeUserDetails);
            const loginResponse = await request(app).post("/user/login").send({
              userName: "Oscar.Allen@email.com",
              password: "lkfksdfksdfj",
            });

            const response = await request(app)
              .post("/invite")
              .set("Authorization", loginResponse.headers.authorization)
              .send({
                // email: "Oscar.Allen@email.com",
                invitee: "Jake.Waterman@email.com",
                inviter: "Oscar.Allen@email.com",
              });
            expect(response.statusCode).toBe(201);
            expect(response.body.invite).toEqual({
              inviter: "Oscar.Allen@email.com",
              invitee: "Jake.Waterman@email.com",
              uuid: expect.toBeUUID(),
              exp: currentTime + lengthOfDayInMilliseconds,
            });
            jest.useRealTimers();
          });
        });
      });
      describe("when the inviter and invitee are the same", () => {
        it("responds with http status code 403", async () => {
          const userDetails = {
            firstName: "Oscar",
            lastName: "Allen",
            email: "Oscar.Allen@email.com",
            password: "lkfksdfksdfj",
          };
          await request(app).post("/user/signup").send(userDetails);
          const loginResponse = await request(app).post("/user/login").send({
            userName: "Oscar.Allen@email.com",
            password: "lkfksdfksdfj",
          });

          const response = await request(app)
            .post("/invite")
            .set("Authorization", loginResponse.header.authorization)
            .send({
              inviter: "Oscar.Allen@email.com",
              invitee: "Oscar.Allen@email.com",
            });

          expect(response.statusCode).toBe(403);
          expect(response.body.errors).toEqual([
            "Users cannot send invites to themselves",
          ]);
        });
      });
      describe("and the invitee is not an existing user", () => {
        describe("when the inviter send an invite to the invitee", () => {
          it("responds with http status code 403", async () => {
            const userDetails = {
              firstName: "Oscar",
              lastName: "Allen",
              email: "Oscar.Allen@email.com",
              password: "lkfksdfksdfj",
            };
            await request(app).post("/user/signup").send(userDetails);
            const loginResponse = await request(app).post("/user/login").send({
              userName: "Oscar.Allen@email.com",
              password: "lkfksdfksdfj",
            });
            const response = await request(app)
              .post("/invite")
              .set("Authorization", loginResponse.header.authorization)
              .send({
                inviter: "Oscar.Allen@email.com",
                invitee: "NotExistingUser@email.com",
              });
            expect(response.statusCode).toBe(403);
            expect(response.body.errors).toEqual([
              "Invitation could not be sent",
            ]);
          });
        });
      });
    });
  });
  describe("retrieving received invites", () => {
    describe("given an invite exists", () => {
      describe("and a user is logged in as the invitee", () => {
        describe("when the user retrieves their received invite", () => {
          it("their invite will be retrieved", async () => {
            jest.useFakeTimers({ doNotFake: ["setImmediate"] });
            const currentTime = Date.now();
            jest.setSystemTime(currentTime);

            const user1Details = {
              firstName: "player",
              lastName: "1",
              email: "player1@email.com",
              password: "somethingSafe",
            };
            const user2Details = {
              firstName: "player",
              lastName: "1",
              email: "player2@email.com",
              password: "somethingSafe",
            };

            await Promise.allSettled([
              request(app).post("/user/signup").send(user1Details),
              request(app).post("/user/signup").send(user2Details),
            ]);
            const inviterResponse = await request(app)
              .post("/user/login")
              .send({
                userName: "player1@email.com",
                password: "somethingSafe",
              });

            await request(app)
              .post("/invite")
              .set("Authorization", inviterResponse.header.authorization)
              .send({
                invitee: "player2@email.com",
                inviter: "player1@email.com",
              });

            const inviteeResponse = await request(app)
              .post("/user/login")
              .send({
                userName: "player2@email.com",
                password: "somethingSafe",
              });
            const response = await request(app)
              .get("/invite/inbox")
              .set("Authorization", inviteeResponse.header.authorization)
              .send();

            expect(response.statusCode).toBe(200);
            expect(response.body.invites).toEqual([
              {
                inviter: "player1@email.com",
                invitee: "player2@email.com",
                uuid: expect.toBeUUID(),
                exp: currentTime + lengthOfDayInMilliseconds,
                status: "PENDING",
              },
            ]);
            jest.useRealTimers();
          });
        });
      });
    });
  });
});

// TODO: implement tests for a testFixture which I WOULD LIKE TO USE
// Example of what its usage may be like is below

// const fixture = new TestFixture("http://api.connect-4.com")
//   .createUser("testUser", "password123")
//   .login("testUser", "password123")
//   .logout()
//   .deleteUser("testUser");

import { appFactory } from "@/app";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import {
  generateKeyPair,
  GenerateKeyPairResult,
  jwtDecrypt,
  KeyLike,
} from "jose";
import { last, path, pipe, split } from "ramda";
import request, { Response } from "supertest";

const user1Details = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@foo.com",
  password: "iamjohndoe",
};

describe("user-integration", () => {
  let jwtKeyPair: GenerateKeyPairResult<KeyLike>;
  let app: Express;
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
      publishInternalEvent: (details) => Promise.resolve(),
    });
  });

  describe("signup", () => {
    describe("given the user does not exist", () => {
      it("creates a user", async () => {
        const response = await request(app)
          .post("/user/signup")
          .send(user1Details);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(
          expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@foo.com",
            uuid: expect.toBeUUID(),
          }),
        );
        expect(response.headers["content-type"]).toMatch(/json/);
      });
    });
    describe("given a user already exists with a given email", () => {
      it("forbids creation of another user with that email", async () => {
        await request(app).post("/user/signup").send(user1Details);
        const response = await request(app)
          .post("/user/signup")
          .send(user1Details);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
          errors: ["A user with that email already exists"],
        });
        expect(response.headers["content-type"]).toMatch(/json/);
      });
    });
    describe("given invalid user details", () => {
      it("forbids creation of user", async () => {
        const response = await request(app).post("/user/signup").send({
          firstName: "Frank",
          lastName: "Herbert",
        });
        expect(response.statusCode).toBe(403);
        expect(response.body.errors).toEqual([
          { message: `"email" is required`, path: "email" },
          { message: `"password" is required`, path: "password" },
        ]);
      });
    });
  });

  describe("delete", () => {
    describe("given the user exists", () => {
      describe("and a valid email is provided", () => {
        describe("and the email of the user to be deleted is the same as the user email making the request", () => {
          it("deletes the user", async () => {
            const userSignupDetails = {
              firstName: "test",
              lastName: "1",
              email: "test1@email.com",
              password: "testPassword",
            };

            await request(app).post("/user/signup").send(userSignupDetails);

            const userCredentials = {
              userName: "test1@email.com",
              password: "testPassword",
            };
            const authorizationHeader = await request(app)
              .post("/user/login")
              .send(userCredentials)
              .then((loginResponse) =>
                pipe<[Response], string>(path(["headers", "authorization"]))(
                  loginResponse,
                ),
              );

            const response = await request(app)
              .post("/user/delete")
              .set("Authorization", authorizationHeader)
              .send({ email: "test1@email.com" });
            expect(response.body).toEqual({ isSuccess: true });
          });
        });
        describe("and a user is attempting to delete another users account", () => {
          it("does not delete the user", async () => {
            const userSignupDetails = {
              firstName: "testUser",
              lastName: "2",
              email: "test2@email.com",
              password: "testPassword",
            };

            const anotherUserSignUpDetails = {
              firstName: "another",
              lastName: "user",
              email: "anotherUser@email.com",
              password: "testPassword",
            };

            await request(app)
              .post("/user/signup")
              .send(anotherUserSignUpDetails);
            await request(app).post("/user/signup").send(userSignupDetails);

            const userCredentials = {
              userName: "test2@email.com",
              password: "testPassword",
            };
            const authorizationHeader = await request(app)
              .post("/user/login")
              .send(userCredentials)
              .then((loginResponse) =>
                pipe<[Response], string>(path(["headers", "authorization"]))(
                  loginResponse,
                ),
              );

            const response = await request(app)
              .post("/user/delete")
              .set("Authorization", authorizationHeader)
              .send({ email: "anotherUser@email.com" });
            expect(response.body).toEqual({ isSuccess: false });
          });
        });
      });
    });
  });
  describe("login", () => {
    describe("given a user already exists", () => {
      describe("and they provide the correct credentials", () => {
        it("they are provided with a session token", async () => {
          const date = Date.now();
          jest.useFakeTimers({ doNotFake: ["setImmediate"] });
          jest.setSystemTime(date);

          const userDetails = {
            firstName: "timmy",
            lastName: "blue",
            email: "timmy@gmail.com",
            password: "timmyBlue",
          };
          await request(app).post("/user/signup").send(userDetails);

          const userCredentials = {
            userName: "timmy@gmail.com",
            password: "timmyBlue",
          };
          const { protectedHeader, payload } = await request(app)
            .post("/user/login")
            .send(userCredentials)
            .then((loginResponse) =>
              pipe<[Response], string, Array<string>, string>(
                path(["headers", "authorization"]),
                split(" "),
                last,
              )(loginResponse),
            )
            .then((jwt) => jwtDecrypt(jwt, jwtKeyPair.privateKey));

          const durationOfDayInSeconds = 24 * 60 * 60;
          const currentDateInSeconds = Math.floor(date / 1000);
          expect(protectedHeader).toEqual({
            alg: "RSA-OAEP-256",
            enc: "A128CBC-HS256",
            typ: "JWT",
          });
          expect(payload).toEqual({
            iss: "connect4-http-gameserver",
            iat: currentDateInSeconds,
            exp: currentDateInSeconds + durationOfDayInSeconds,
            sub: "timmy@gmail.com",
            nbf: currentDateInSeconds,
            userName: "timmy@gmail.com",
            roles: [],
          });
          jest.useRealTimers();
        });
        it("receives the relative path to the notifications endpoint", async () => {
          const jwtKeyPair = await generateKeyPair("RS256");
          const app = appFactory({
            stage: "test",
            keys: { jwtKeyPair: jwtKeyPair },
            publishInternalEvent: () => Promise.resolve(),
          });

          const testFixture = new TestFixture(app);
          const response = await testFixture.signUpAndLoginEmailResponse(
            "notification@email.com",
          );
          expect(response.body.notification).toEqual({
            uri: expect.any(String),
          });
        });
      });
      describe("and they provide incorrect credentials", () => {
        it("returns with http error code 403", async () => {
          const userDetails = {
            firstName: "Mikhail",
            lastName: "Bulgakov",
            email: "master@margarita.ru",
            password: "sunsethour",
          };
          await request(app).post("/user/signup").send(userDetails);
          const userCredentials = {
            userName: "master@margarita.ru",
            password: "moongoesmad",
          };
          const response = await request(app)
            .post("/user/login")
            .send(userCredentials);
          expect(response.statusCode).toBe(403);
          expect(response.body.errors).toEqual([{ message: "Login failed" }]);
        });
      });
    });
    describe("given credentials for a user that does not exist", () => {
      it("responds with http status code 403", async () => {
        const credentials = {
          email: "some@email.com",
          password: "asljdalsdsd",
        };
        const response = await request(app)
          .post("/user/login")
          .send(credentials);
        expect(response.statusCode).toBe(403);
      });
    });
  });
  describe("user", () => {
    describe("given a user does not provide an authorisation token", () => {
      describe("when they attempt to view their user details", () => {
        it("responds with http status code 401", async () => {
          const response = await request(app).get("/user").send();
          expect(response.statusCode).toBe(401);
          expect(response.body.errors).toEqual([
            "You must be logged in to view your user details",
            ,
          ]);
        });
      });
    });
    describe("given a user provided an authorisation token", () => {
      describe("and their token is invalid", () => {
        it("responds with http status code 401", async () => {
          const response = await request(app)
            .get("/user")
            .send()
            .set("Authorization", "somethingTokenW")
            .send();
          expect(response.statusCode).toBe(401);
          expect(response.body.errors).toEqual([
            "You must be logged in to view your user details",
          ]);
        });
      });

      describe("and their token is expired", () => {
        it("responds with http status code 401", async () => {
          jest.useFakeTimers({
            doNotFake: ["setImmediate"],
          });

          const userSignupDetails = {
            firstName: "Rolling",
            lastName: "Cat",
            email: "khai@email.com",
            password: "skdhakslndkasnd",
          };

          const user = await request(app)
            .post("/user/signup")
            .send(userSignupDetails);
          expect(user.statusCode).toBe(201);

          const userCredentials = {
            userName: "khai@email.com",
            password: "skdhakslndkasnd",
          };
          const authorizationHeader = await request(app)
            .post("/user/login")
            .send(userCredentials)
            .then((loginResponse) =>
              pipe<[Response], string>(path(["headers", "authorization"]))(
                loginResponse,
              ),
            );

          jest.setSystemTime(200000);
          const response = await request(app)
            .get("/user")
            .set("Authorization", authorizationHeader)
            .send({ email: "khai@email.com" });

          expect(response.statusCode).toBe(401);
          expect(response.body.errors).toEqual([
            "You must be logged in to view your user details",
          ]);
          jest.useRealTimers();
        });
      });
      describe("and their token is valid", () => {
        it("responds with the user's details", async () => {
          const userSignupDetails = {
            firstName: "Rolling",
            lastName: "Cat",
            email: "chef@email.com",
            password: "skdhakslndkasnd",
          };

          const user = await request(app)
            .post("/user/signup")
            .send(userSignupDetails);
          expect(user.statusCode).toBe(201);

          const userCredentials = {
            userName: "chef@email.com",
            password: "skdhakslndkasnd",
          };
          const authorizationHeader = await request(app)
            .post("/user/login")
            .send(userCredentials)
            .then((loginResponse) =>
              pipe<[Response], string>(path(["headers", "authorization"]))(
                loginResponse,
              ),
            );

          const response = await request(app)
            .get("/user")
            .set("Authorization", authorizationHeader)
            .send({ email: "chef@email.com" });

          const userDetails = {
            firstName: "Rolling",
            lastName: "Cat",
            email: "chef@email.com",
          };
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(userDetails);
        });
      });
    });
  });
});

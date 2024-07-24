import { appFactory } from "@/app";
import { generateKeyPair, jwtDecrypt } from "jose";
import { last, path, pipe, split } from "ramda";
import request, { Response } from "supertest";
const app = appFactory();

const user1Details = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@foo.com",
  password: "iamjohndoe",
};
describe("user-integration", () => {
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
          })
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
      it.skip("forbids creation of user", async () => {
        const response = await request(app).post("/user/signup").send({
          firstName: "Frank",
          lastName: "Herbert",
        });
        expect(response.statusCode).toBe(403);
        expect(response.body.errors).toEqual([
          { message: `"password" is required`, path: "password" },
          { message: `"email" is required`, path: "email" },
        ]);
      });
    });
  });
  describe("login", () => {
    describe("given a user already exists", () => {
      describe("and they provide the correct credentials", () => {
        it("they are provided with a session token", async () => {
          const { publicKey, privateKey } = await generateKeyPair("RS256");
          const app = appFactory({ jwtPublicKeySet: publicKey });

          const date = Date.now();
          jest.useFakeTimers({ doNotFake: ["setImmediate"] });
          jest.setSystemTime(date);

          const userDetails = {
            firstName: "Dung",
            lastName: "Eater",
            email: "dung.eater@gmail.com",
            password: "iamthedungeater",
          };
          await request(app).post("/user/signup").send(userDetails);

          const userCredentials = {
            userName: "dung.eater@gmail.com",
            password: "iamthedungeater",
          };
          const { protectedHeader, payload } = await request(app)
            .post("/user/login")
            .send(userCredentials)
            .then((loginResponse) =>
              pipe<[Response], string, Array<string>, string>(
                path(["headers", "authorization"]),
                split(" "),
                last
              )(loginResponse)
            )
            .then((jwt) => jwtDecrypt(jwt, privateKey));

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
            sub: "dung.eater@gmail.com",
            nbf: currentDateInSeconds,
            userName: "dung.eater@gmail.com",
            roles: [],
          });
          jest.useRealTimers();
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
      });
    });
  });
});

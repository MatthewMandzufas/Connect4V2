import { app } from "@/app";
import request from "supertest";

describe("user-integration", () => {
  describe("sign-up", () => {
    describe("given a user does not yet exist", () => {
      it("creates a user ", async () => {
        const johnDoeUser = {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          password: "12345678",
        };

        const response = await request(app)
          .post("/user/signup")
          .send(johnDoeUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(
          expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            uuid: expect.toBeUUID(),
          })
        );
        expect(response.headers["content-type"]).toMatch(/json/);
      });
    });
    describe("given a user already exists with a given email", () => {
      it("forbids the creation of a user with the same email", async () => {
        const johnDoeUser = {
          firstName: "Alex",
          lastName: "Bon",
          email: "alex.don@email.com",
          password: "12345678",
        };
        await request(app).post("/user/signup").send(johnDoeUser);

        const response = await request(app)
          .post("/user/signup")
          .send(johnDoeUser);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({
          errors: ["A user with that email already exists"],
        });
        expect(response.headers["content-type"]).toMatch(/json/);
      });
    });
    describe("given invalid user details", () => {
      it("forbids the creation of the user", async () => {
        const userWithMissingPasswordAndLastName = {
          firstName: "Dasiy",
          email: "daisy.a@email.com",
        };

        const response = await request(app)
          .post("/user/signup")
          .send(userWithMissingPasswordAndLastName);

        expect(response.statusCode).toBe(403);
        expect(response.body.errors).toEqual([
          {
            message: '"lastName" is required',
            path: "lastName",
          },
          {
            message: '"password" is required',
            path: "password",
          },
        ]);
        expect(response.headers["content-type"]).toMatch(/json/);
      });
    });
  });
});

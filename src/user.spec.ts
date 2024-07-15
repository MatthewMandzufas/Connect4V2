import app from "@/index";
import request from "supertest";

describe("user-integreation", () => {
  describe("sign-up", () => {
    describe("given a user does not yet exist", () => {
      it("creates a user ", async () => {
        const response = await request(app).post("/user/signup").send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toBe(
          expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            uuid: expect.toBeUUID(),
          })
        );
        expect(response.headers["Content-Type"]).toMatch(/json/);
      });
    });
  });
});

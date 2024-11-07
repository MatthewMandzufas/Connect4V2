import BackendApi from "@/backend-api";
import LoginService from "./login-service";

describe("login-service", () => {
  const backendApi = new BackendApi({
    url: `http://localhost:3000`,
  });

  describe("given a user exists", () => {
    beforeAll(async () => {
      await fetch(`http://localhost:3000/user/signup`, {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Pork",
          email: "john.pork@gmail.com",
          password: "Hello123",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    describe("and the user logs in with their email and password", () => {
      it("logs in the user", async () => {
        const loginService = new LoginService({
          backendApi,
        });
        const response = await loginService.login({
          email: "john.pork@gmail.com",
          password: "Hello123",
        });

        expect(response).toEqual({
          isSuccess: true,
          message: "Login Successful!",
          token: expect.any(String),
        });
      });
    });
    describe("and the user attempts to log in with an invalid password", () => {
      it("the user fails to log in", async () => {
        const loginService = new LoginService({
          backendApi,
        });
        const response = await loginService.login({
          email: "john.pork@gmail.com",
          password: "wrongPassword",
        });

        expect(response).toEqual({
          isSuccess: false,
          message: "Login Failed.",
        });
      });
    });
  });
  describe("given a user does not exist", () => {
    describe("and the user attempts to log in", () => {
      it("login fails", async () => {
        const loginService = new LoginService({
          backendApi,
        });
        const response = await loginService.login({
          email: "nonExistentUser@gmail.com",
          password: "Hello123",
        });

        expect(response).toEqual({
          isSuccess: false,
          message: "Login Failed.",
        });
      });
    });
  });
});

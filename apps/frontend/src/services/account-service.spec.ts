import BackendApi from "@/backend-api";
import nock from "nock";
import AccountService from "./account-service";

const backendApi = new BackendApi({ url: "http://localhost:3001" });
nock("http://localhost:3001")
  .persist()
  .post("/user/signup")
  .reply(201, { isSuccess: true });

nock("http://localhost:3001")
  .persist()
  .post("/user/delete")
  .reply(200, { isSuccess: true });

nock("http://localhost:3001")
  .persist()
  .defaultReplyHeaders({ authorization: "token" })
  .post("/user/login")
  .reply(200, { isSuccess: true });

const accountService = new AccountService({ backendApi });

describe("account-service", () => {
  describe("signing up", () => {
    describe("given valid user signup details", () => {
      it("signs up the user", async () => {
        expect(
          await accountService.signUp({
            firstName: "First",
            lastName: "Last",
            email: "email@mail.com",
            password: "SomethingSecure!",
          })
        ).toEqual({ isSuccess: true, message: "Sign up successful!" });
      });
    });
  });
  describe("deleting a user", () => {
    describe("given an email of an existing user", () => {
      it("deletes a user", async () => {
        const response = await accountService.deleteUser("email@mail.com");
        expect(response).toEqual({
          isSuccess: true,
          message: "User successfully deleted!",
        });
      });
    });
  });
  describe("logging in", () => {
    describe("given an existing user", () => {
      describe("and valid login credentials", () => {
        beforeAll(async () => {
          await accountService.signUp({
            firstName: "John",
            lastName: "Pork",
            email: "john.pork@gmail.com",
            password: "Hello123",
          });
        });

        it("logs in the user", async () => {
          const response = await accountService.login({
            email: "john.pork@gmail.com",
            password: "Hello123",
          });

          expect(response).toEqual({
            isSuccess: true,
            token: expect.any(String),
            message: "Login successful!",
          });
        });
      });
    });
  });
});

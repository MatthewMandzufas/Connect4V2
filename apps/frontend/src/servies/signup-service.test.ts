import AccountService from "./signup-service";

const backendUrl = "http://localhost:3001/user";

const accountService = new AccountService({ backendUrl });
describe("signup-service", () => {
  describe("given valid user details", () => {
    it("signs up the user", async () => {
      expect(
        await accountService.signUp({
          firstName: "First",
          lastName: "Last",
          email: "email@mail.com",
          password: "SomethingSecure!",
        })
      ).toEqual({ isSuccess: true });
    });
    it("deletes a user", async () => {
      const response = await accountService.deleteUser("email@mail.com");
      expect(response).toEqual({ isSuccess: true });
    });
  });
});

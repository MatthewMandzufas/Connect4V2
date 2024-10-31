import SignUpService from "./signup-service";

const backendUrl = "http://localhost:3001/user/signup";

describe("signup-service", () => {
  describe("given valid user details", () => {
    it("signs up the user", async () => {
      const signUpService = new SignUpService({ backendUrl });
      expect(
        await signUpService.signUp({
          firstName: "First",
          lastName: "Last",
          email: "email@mail.com",
          password: "SomethingSecure!",
        })
      ).toEqual({ isSuccess: true });
    });
  });
});

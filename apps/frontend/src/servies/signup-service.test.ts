describe("signup-service", () => {
  describe("given valid user details", () => {
    it("signs up the user", () => {
      // TODO: createSignUpService - what does this require as arguments?
      const signUpService = new createSignUpService({ backendUrl: "" });
      expect(
        signUpService.signUp({
          firstName: "First",
          lastName: "Last",
          email: "email@mail.com",
          password: "SomethingSecure!",
        })
      ).resolves.toEqual({ isSuccess: true, token: expect.any(String) });
    });
  });
});

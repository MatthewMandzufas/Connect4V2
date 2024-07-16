import validateUserSignupRequestBody from "@/user/validate-user-signup-request-body";

describe("validate-user-signup-request-body", () => {
  describe("given a well-formatted user signup request body", () => {
    it("passes validation", () => {
      const userRequestBody = {
        firstName: "Alex",
        lastName: "Witherden",
        email: "alex.witherden@email.com",
        password: "15Disposals",
      };
      const validationResult = validateUserSignupRequestBody(userRequestBody);
      expect(validationResult).toEqual({
        isValid: true,
      });
    });
  });
});

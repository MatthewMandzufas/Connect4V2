import validateUserSignupRequestBody from "@/user/validate-user-signup-request-body";
import { UserSignupRequestBody } from "./user-router.d";

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
  describe("given a signup request body with a missing field", () => {
    it("throws an error", () => {
      const userRequestBody = {
        firstName: "Nigel",
        lastName: "Thornberry",
        email: "nigel.thornberry@email.com",
      };
      const validationResult = validateUserSignupRequestBody(
        userRequestBody as UserSignupRequestBody
      );
      expect(validationResult).toEqual({
        isValid: false,
        errors: [
          {
            message: '"password" is required',
            path: "password",
          },
        ],
      });
    });
  });
});

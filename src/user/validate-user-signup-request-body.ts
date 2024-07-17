import { UserSignupRequestBody } from "@/user/user-router.d";
import { ValidationResult } from "@/user/validation.d";
import Joi, { ValidationErrorItem } from "joi";
import { applySpec, join, map, path, pipe, prop } from "ramda";

const validSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
export default function validateUserSignupRequestBody(
  userSignUpRequestBody: UserSignupRequestBody
): ValidationResult {
  const validationResult = validSchema.validate(userSignUpRequestBody, {
    abortEarly: false,
  });
  const isValid = validationResult.error === undefined;

  if (!isValid) {
    return {
      isValid,
      errors: pipe<
        [Joi.ValidationResult],
        ValidationErrorItem[],
        { message: string; path: string }[]
      >(
        path(["error", "details"]),
        map(
          applySpec({
            message: prop("message"),
            path: pipe(prop("path"), join(".")),
          })
        )
      )(validationResult),
    };
  }

  return {
    isValid: true,
  };
}

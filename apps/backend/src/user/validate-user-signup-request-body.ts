import Joi, { ValidationErrorItem } from "joi";
import { applySpec, join, map, path, pipe, prop } from "ramda";

const validSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export type UserSignupRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function validateUserSignupRequestBody(
  userSignUpRequestBody: UserSignupRequestBody,
): ValidationResult {
  const validationResult = validSchema.validate(userSignUpRequestBody, {
    abortEarly: false,
  });
  const isValid = validationResult.error === undefined;

  if (!isValid) {
    return {
      isValid,
      // @ts-ignore
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
          }),
        ),
      )(validationResult),
    };
  }

  return {
    isValid: true,
  };
}

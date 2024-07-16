import { UserSignupRequestBody } from "@/user/user-router.d";
import { ValidationResult } from "@/user/validation.d";
import Joi from "joi";

const validSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
export default function validateUserSignupRequestBody(
  userSignUpRequestBody: UserSignupRequestBody
): ValidationResult {
  return {
    isValid: validSchema.validate(userSignUpRequestBody).error === undefined,
  };
}

import { KeyLike } from "jose";

export type UserSignupRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type PredefinedPublicKeySet = {
  jwtPublicKeySet: KeyLike;
};

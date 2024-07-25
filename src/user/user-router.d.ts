import { KeyLike } from "jose";

export type UserSignupRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type KeyPairSet = {
  jwtKeyPair?: {
    publicKey: KeyLike;
    privateKey: KeyLike;
  };
};

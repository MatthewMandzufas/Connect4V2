import { jwtDecrypt, jwtVerify, KeyLike } from "jose";
import { JWEInvalid, JWTExpired } from "jose/errors";

const getIsUserAuthorized = async (token: string, privateKey: KeyLike) => {
  try {
    await jwtDecrypt(token, privateKey);
    await jwtVerify(token, privateKey);
  } catch (error) {
    if (error instanceof JWEInvalid || error instanceof JWTExpired)
      return false;
  }
};

export default getIsUserAuthorized;

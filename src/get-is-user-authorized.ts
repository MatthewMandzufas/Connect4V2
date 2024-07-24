import { jwtDecrypt, KeyLike } from "jose";
import { JWEInvalid } from "jose/errors";

const getIsUserAuthorized = async (token: string, privateKey: KeyLike) => {
  try {
    await jwtDecrypt(token, privateKey);
  } catch (error) {
    if (error instanceof JWEInvalid) {
      return false;
    }
  }
};

export default getIsUserAuthorized;

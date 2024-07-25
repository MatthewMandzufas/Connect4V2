import { jwtDecrypt, KeyLike } from "jose";
import { JWEInvalid, JWTExpired } from "jose/errors";

const getIsUserAuthorized = async (
  token: string,
  privateKey: KeyLike,
  userEmail: string
) => {
  try {
    const { payload } = await jwtDecrypt(token, privateKey);

    if (payload.userName !== userEmail) {
      return false;
    }
    return true;
  } catch (error) {
    if (error instanceof JWEInvalid || error instanceof JWTExpired)
      return false;
  }
};

export default getIsUserAuthorized;

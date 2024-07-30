import { jwtDecrypt, KeyLike } from "jose";

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
    return false;
  }
};

export default getIsUserAuthorized;

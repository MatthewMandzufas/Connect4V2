import { PredefinedPublicKeySet } from "@/user/user-router.d";
import UserService, { AuthenticationFailedError } from "@/user/user-service";
import express, { RequestHandler } from "express";
import { EncryptJWT, generateKeyPair, KeyLike } from "jose";

const signupRequestHandlerFactory =
  (userService: UserService): RequestHandler =>
  (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    userService
      .create({
        firstName,
        lastName,
        email,
        password,
      })
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((err: Error) => {
        res.status(403).send({ errors: [err.message] });
      })
      .catch(next);
  };

const loginRequestHandlerFactory =
  (userService: UserService, jwtPublicKey?: KeyLike): RequestHandler =>
  async (req, res, next) => {
    jwtPublicKey ??= (await generateKeyPair("RS256")).publicKey;
    const { userName, password } = req.body;
    try {
      await userService.authenticate({ email: userName, password });
      new EncryptJWT({ userName, roles: [] })
        .setProtectedHeader({
          alg: "RSA-OAEP-256",
          enc: "A128CBC-HS256",
          typ: "JWT",
        })
        .setIssuedAt()
        .setIssuer("connect4-http-gameserver")
        .setExpirationTime("1 day")
        .setSubject(userName)
        .setNotBefore("0s")
        .encrypt(jwtPublicKey)
        .then((jwtContent) =>
          res
            .status(200)
            .setHeader("Authorization", `Basic ${jwtContent}`)
            .send()
        );
    } catch (err) {
      if (err instanceof AuthenticationFailedError)
        res.status(403).send({ errors: [{ message: "Login failed" }] });
    } finally {
      next();
    }
  };

const userRouterFactory = (
  userService: UserService,
  keys?: PredefinedPublicKeySet
) => {
  const userRouter = express.Router();
  userRouter.post("/signup", signupRequestHandlerFactory(userService));
  userRouter.post(
    "/login",
    loginRequestHandlerFactory(userService, keys?.jwtPublicKeySet)
  );
  return userRouter;
};
export default userRouterFactory;

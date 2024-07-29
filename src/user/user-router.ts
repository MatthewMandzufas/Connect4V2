import getIsUserAuthorized from "@/get-is-user-authorized";
import { KeyPairSet } from "@/user/user-router.d";
import UserService, { AuthenticationFailedError } from "@/user/user-service";
import express, { RequestHandler } from "express";
import { EncryptJWT, generateKeyPair, KeyLike } from "jose";

const userDetailsRequestHandlerFactory =
  (userService: UserService, jwtPrivateKey: KeyLike): RequestHandler =>
  async (req, res, next) => {
    const { email } = req.body;

    // TODO: Move this to some middleware?
    const authorizationToken = req.headers.authorization;
    const isAuthorized = await getIsUserAuthorized(
      authorizationToken,
      jwtPrivateKey,
      email
    );
    if (isAuthorized) {
      const userDetails = await userService.getUserDetails(email);
      res.status(200).send(userDetails);
    } else {
      res
        .status(401)
        .send({ errors: ["You must be logged in to view your user details"] });
    }
    next();
  };

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
          res.status(200).setHeader("Authorization", jwtContent).send()
        );
    } catch (err) {
      if (err instanceof AuthenticationFailedError)
        res.status(403).send({ errors: [{ message: "Login failed" }] });
    } finally {
      next();
    }
  };

const userRouterFactory = (userService: UserService, keys: KeyPairSet) => {
  const userRouter = express.Router();
  userRouter.get(
    "/",
    userDetailsRequestHandlerFactory(userService, keys.jwtKeyPair.privateKey)
  );
  userRouter.post("/signup", signupRequestHandlerFactory(userService));
  userRouter.post(
    "/login",
    loginRequestHandlerFactory(userService, keys.jwtKeyPair.publicKey)
  );
  return userRouter;
};
export default userRouterFactory;

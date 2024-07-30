import resolveRouters, { RouterType } from "@/resolve-routers";
import { KeyPairSet } from "@/user/user-router.d";
import validateUserSignupRequest from "@/user/validate-user-signup-request";
import express, { RequestHandler } from "express";
import { KeyLike } from "jose";
import getIsUserAuthorized from "./get-is-user-authorized";

type AppFactoryParameters = {
  stage: Stage;
  keys: KeyPairSet;
};

const createAuthorizationMiddleware =
  (jwtPrivateKey: KeyLike): RequestHandler =>
  async (req, res, next) => {
    const authorizationToken = req.headers.authorization;

    const { email } = req.body;
    res.locals.user = email;
    res.locals.isAuthorized = await getIsUserAuthorized(
      authorizationToken,
      jwtPrivateKey,
      email
    );

    next();
  };

export const appFactory = (
  { keys }: AppFactoryParameters = {
    stage: "production",
    keys: {},
  }
) => {
  const routers = resolveRouters(process.env.NODE_ENV as Stage, keys);
  const app = express()
    .use(express.json())
    .use(createAuthorizationMiddleware(keys.jwtKeyPair.privateKey))
    .use("/user", validateUserSignupRequest, routers[RouterType.userRouter])
    .use("/invite", routers[RouterType.inviteRouter]);
  return app;
};

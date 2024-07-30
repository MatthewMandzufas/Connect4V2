import resolveRouters, { RouterType } from "@/resolve-routers";
import { KeyPairSet } from "@/user/user-router.d";
import validateUserSignupRequest from "@/user/validate-user-signup-request";
import express, { RequestHandler } from "express";
import { jwtDecrypt, KeyLike } from "jose";

type AppFactoryParameters = {
  stage: Stage;
  keys: KeyPairSet;
};

const createAuthenticationMiddleware =
  (jwtPrivateKey: KeyLike): RequestHandler =>
  async (req, res, next) => {
    const authorizationField = req.headers.authorization;

    if (authorizationField) {
      try {
        const { payload } = await jwtDecrypt(
          authorizationField.split(" ")[1],
          jwtPrivateKey
        );
        res.locals.claims = {
          email: payload.userName,
        };
      } catch (error) {}
    }

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
    .use(createAuthenticationMiddleware(keys.jwtKeyPair.privateKey))
    .use("/user", validateUserSignupRequest, routers[RouterType.userRouter])
    .use("/invite", routers[RouterType.inviteRouter]);
  return app;
};

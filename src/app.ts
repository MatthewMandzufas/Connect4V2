import resolveRouters, { RouterType } from "@/resolve-routers";
import { KeyPairSet } from "@/user/user-router.d";
import validateUserSignupRequest from "@/user/validate-user-signup-request";
import express from "express";

type AppFactoryParameters = {
  stage: Stage;
  keys: KeyPairSet;
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
    .use("/user", validateUserSignupRequest, routers[RouterType.userRouter])
    .use("/invite", routers[RouterType.inviteRouter]);
  return app;
};

import resolveRouters, { RouterType } from "@/resolve-routers";
import { PredefinedPublicKeySet } from "@/user/user-router.d";
import validateUserSignupRequest from "@/user/validate-user-signup-request";
import express from "express";

export const appFactory = (keys?: PredefinedPublicKeySet) => {
  const routers = resolveRouters(process.env.NODE_ENV as NodeEnv, keys);
  const app = express()
    .use(express.json())
    .use("/user", validateUserSignupRequest, routers[RouterType.userRouter]);
  return app;
};

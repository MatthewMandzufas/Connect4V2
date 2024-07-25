import userRouterFactory from "@/user/user-router";
import { KeyPairSet } from "@/user/user-router.d";
import UserService from "@/user/user-service";
import { Router } from "express";
import InMemoryUserRepositoryFactory from "./user/in-memory-user-repository";

export enum RouterType {
  "userRouter",
}

const resolveRouters = (
  env: Stage,
  keys?: KeyPairSet
): Record<RouterType, Router> => {
  const userRepository =
    env !== "production"
      ? new InMemoryUserRepositoryFactory()
      : new InMemoryUserRepositoryFactory();
  const userService = new UserService(userRepository);
  return {
    [RouterType.userRouter]: userRouterFactory(userService, keys),
  };
};

export default resolveRouters;

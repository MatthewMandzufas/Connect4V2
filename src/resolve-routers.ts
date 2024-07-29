import userRouterFactory from "@/user/user-router";
import { KeyPairSet } from "@/user/user-router.d";
import UserService from "@/user/user-service";
import { Router } from "express";
import inviteRouterFactory from "./invite/invite-router-factory";
import InMemoryUserRepositoryFactory from "./user/in-memory-user-repository";

export enum RouterType {
  "userRouter",
  "inviteRouter",
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
    [RouterType.inviteRouter]: inviteRouterFactory(),
  };
};

export default resolveRouters;

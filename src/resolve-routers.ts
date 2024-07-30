import userRouterFactory from "@/user/user-router";
import { KeyPairSet } from "@/user/user-router.d";
import UserService from "@/user/user-service";
import { Router } from "express";
import InMemoryInviteRepository from "./invite/in-memory-invite-repository";
import inviteRouterFactory from "./invite/invite-router-factory";
import InviteService from "./invite/invite-service";
import InMemoryUserRepositoryFactory from "./user/in-memory-user-repository";

export enum RouterType {
  "userRouter",
  "inviteRouter",
}

const resolveRouters = (
  env: Stage,
  keys: KeyPairSet
): Record<RouterType, Router> => {
  const userRepository =
    env !== "production"
      ? new InMemoryUserRepositoryFactory()
      : new InMemoryUserRepositoryFactory();
  const inviteRepository =
    env !== "production"
      ? new InMemoryInviteRepository()
      : new InMemoryInviteRepository();
  const userService = new UserService(userRepository);
  const inviteService = new InviteService(userService, inviteRepository);
  return {
    [RouterType.userRouter]: userRouterFactory(userService, keys),
    [RouterType.inviteRouter]: inviteRouterFactory(inviteService),
  };
};

export default resolveRouters;

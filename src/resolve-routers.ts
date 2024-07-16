import InMemoryUserRepositoryFactory from "@/user/in-memory-user-repository";
import userRouterFactory from "@/user/user-router";
import UserService from "@/user/user-service";
import { Router } from "express";
import { Env } from "./global";

export enum RouterType {
  "userRouter",
}

export const resolveRouters = (env: Env): Record<RouterType, Router> => {
  const userRepository =
    env !== "production"
      ? new InMemoryUserRepositoryFactory()
      : new InMemoryUserRepositoryFactory();

  const userService = new UserService(userRepository);
  return {
    [RouterType.userRouter]: userRouterFactory(userService),
  };
};

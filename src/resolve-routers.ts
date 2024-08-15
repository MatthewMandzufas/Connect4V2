import userRouterFactory from "@/user/user-router";
import { KeyPairSet } from "@/user/user-router.d";
import UserService from "@/user/user-service";
import { Router } from "express";
import { EventPublisher, Stage } from "./global";
import createInviteEventHandlers from "./invite/create-invite-event-handler";
import InMemoryInviteRepository from "./invite/in-memory-invite-repository";
import inviteRouterFactory from "./invite/invite-router-factory";
import InviteService from "./invite/invite-service";
import InMemoryUserRepositoryFactory from "./user/in-memory-user-repository";

export enum RouterType {
  "userRouter",
  "inviteRouter",
}

type ResolveRouterParameters = {
  stage: Stage;
  keys: KeyPairSet;
  publishEvent: EventPublisher<unknown, unknown>;
};

const resolveRouters = ({
  stage: env,
  keys,
  publishEvent,
}: ResolveRouterParameters): Record<RouterType, Router> => {
  const userRepository =
    env !== "production"
      ? new InMemoryUserRepositoryFactory()
      : new InMemoryUserRepositoryFactory();
  const inviteRepository =
    env !== "production"
      ? new InMemoryInviteRepository()
      : new InMemoryInviteRepository();
  const userService = new UserService(userRepository);
  const inviteService = new InviteService(
    userService,
    inviteRepository,
    createInviteEventHandlers(publishEvent)
  );
  return {
    [RouterType.userRouter]: userRouterFactory(userService, keys),
    [RouterType.inviteRouter]: inviteRouterFactory(inviteService),
  };
};

export default resolveRouters;

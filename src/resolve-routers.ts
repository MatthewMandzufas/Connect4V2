import userRouterFactory from "@/user/user-router";
import { KeyPairSet } from "@/user/user-router.d";
import UserService from "@/user/user-service";
import { Router } from "express";
import { InternalEventPublisher, Stage } from "./global";
import createInviteEventPublishers from "./invite/create-invite-event-publishers";
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
  publishInternalEvent: InternalEventPublisher<any, any>;
  authority: string;
};

const resolveRouters = ({
  stage: env,
  keys,
  publishInternalEvent = () => Promise.resolve(),
  authority: serverSideWebSocketPath,
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
    createInviteEventPublishers(publishInternalEvent)
  );
  return {
    [RouterType.userRouter]: userRouterFactory(
      userService,
      keys,
      serverSideWebSocketPath
    ),
    [RouterType.inviteRouter]: inviteRouterFactory(inviteService),
  };
};

export default resolveRouters;

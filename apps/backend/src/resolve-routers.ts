import UserService from "@/user/user-service";
import { Router } from "express";
import { KeyLike } from "jose";
import Game from "./game/game";
import GameService from "./game/game-service";
import InMemoryGameRepository from "./game/in-memory-game-repository";
import createInviteEventPublishers from "./invite/create-invite-event-publishers";
import InMemoryInviteRepository from "./invite/in-memory-invite-repository";
import inviteRouterFactory from "./invite/invite-router-factory";
import InviteService from "./invite/invite-service";
import InMemorySessionRepository from "./session/in-memory-session-repository";
import sessionRouterFactory from "./session/session-router-factory";
import SessionService from "./session/session-service";
import InMemoryUserRepositoryFactory from "./user/in-memory-user-repository";
import userRouterFactory from "./user/user-router";

export enum RouterType {
  "userRouter",
  "inviteRouter",
  "sessionRouter",
}

type KeyPairSet = {
  jwtKeyPair?: {
    publicKey: KeyLike;
    privateKey: KeyLike;
  };
};

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
  const gameRepository =
    env !== "production"
      ? new InMemoryGameRepository()
      : new InMemoryGameRepository();
  const gameService = new GameService(
    gameRepository,
    (...args) => new Game(...args),
  );
  const sessionRepository =
    env !== "production"
      ? new InMemorySessionRepository()
      : new InMemorySessionRepository();
  const sessionService = new SessionService(
    sessionRepository as SessionRepository,
    gameService,
  );

  const userService = new UserService(userRepository as UserRepository);
  const inviteService = new InviteService(
    userService,
    inviteRepository as InviteRepository,
    createInviteEventPublishers(publishInternalEvent),
    sessionService,
  );
  return {
    [RouterType.userRouter]: userRouterFactory(
      userService,
      keys,
      serverSideWebSocketPath,
    ),
    [RouterType.inviteRouter]: inviteRouterFactory(
      inviteService,
      sessionService,
    ),
    [RouterType.sessionRouter]: sessionRouterFactory(
      sessionService,
      userService,
    ),
  };
};

export default resolveRouters;

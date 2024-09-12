import { PlayerMoveResult } from "@/game/types";

type Uuid = `${string}-${string}-${string}-${string}-${string}`;

export type SessionCreationDetails = {
  inviterUuid: Uuid;
  inviteeUuid: Uuid;
};

export type GameMetaData = {
  gameUuid: Uuid;
  playerOneUuid: Uuid;
  playerTwoUuid: Uuid;
};

export type SessionDetails = {
  uuid: Uuid;
  invitee: {
    uuid: Uuid;
  };
  inviter: {
    uuid: Uuid;
  };
  status: SessionStatus;
  games: Array<GameMetaData>;
  activeGameUuid?: Uuid;
};

export type MoveDetails = {
  sessionUuid: Uuid;
  playerUuid: Uuid;
  targetCell: {
    row: number;
    column: number;
  };
};

export enum SessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
}

export interface SessionInterface {
  createSession: (
    sessionDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionId: Uuid) => Promise<SessionDetails>;
  getGameMetaData: (sessionUuid: Uuid) => Promise<Array<GameMetaData>>;
  getActiveGameUuid: (sessionUuid: Uuid) => Promise<Uuid>;
  addNewGame: (
    sessionUuid: Uuid,
    playerOneUuid: Uuid,
    playerTwoUuid: Uuid
  ) => Promise<Uuid>;
  submitMove: (moveDetails: MoveDetails) => Promise<PlayerMoveResult>;
  getActivePlayer: (sessionUuid: Uuid) => Promise<Uuid>;
}

export interface SessionRepository {
  create: (
    sessionCreationDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionUuid: Uuid) => Promise<SessionDetails>;
  addGame: (
    sessionUuid: Uuid,
    gameUuid: Uuid,
    playerOneUuid: Uuid,
    playerTwoUuid: Uuid
  ) => Promise<SessionDetails>;
  setActiveGame: (sessionUuid: Uuid, gameUuid: Uuid) => Promise<SessionDetails>;
}

export class ActiveGameInProgressError extends Error {}

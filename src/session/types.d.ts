type Uuid = `${string}-${string}-${string}-${string}-${string}`;

export type SessionCreationDetails = {
  inviterUuid: Uuid;
  inviteeUuid: Uuid;
};

export type SessionDetails = {
  uuid: Uuid;
  invitee: {
    uuid: Uuid;
  };
  inviter: {
    uuid: Uuid;
  };
  status: SessionStatus.IN_PROGRESS;
  gameUuids: Array<Uuid>;
  activeGameUuid?: Uuid;
};

export enum SessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
}

export interface SessionInterface {
  createSession: (
    sessionDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionId: Uuid) => Promise<SessionDetails>;
  getGameUuids: (sessionUuid: Uuid) => Promise<Array<Uuid>>;
  getActiveGameUuid: (sessionUuid: Uuid) => Promise<Uuid>;
  addNewGame: (sessionUuid: Uuid) => Promise<Uuid>;
}

export interface SessionRepository {
  create: (
    sessionCreationDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionUuid: Uuid) => Promise<SessionDetails>;
  addGame: (sessionUuid: Uuid, gameUuid: Uuid) => Promise<SessionDetails>;
  setActiveGame: (sessionUuid: Uuid, gameUuid: Uuid) => Promise<SessionDetails>;
}

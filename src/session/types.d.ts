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
};

export enum SessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
}

export interface SessionInterface {
  createSession: (
    sessionDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionId: Uuid) => Promise<SessionDetails>;
}

export interface SessionRepository {
  create: (
    sessionCreationDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionUuid: Uuid) => Promise<SessionDetails>;
}

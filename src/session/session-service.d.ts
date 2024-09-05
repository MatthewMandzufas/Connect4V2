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

export interface SessionRepository {
  create: (
    sessionCreationDetails: SessionCreationDetails
  ) => Promise<SessionDetails>;
  getSession: (sessionUuid: Uuid) => Promise<SessionDetails>;
}

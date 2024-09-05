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
  create: (sessionCreationDetails: SessionCreationDetails) => SessionDetails;
  getSession: (sessionUuid: Uuid) => SessionDetails;
}

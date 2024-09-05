type Uuid = `${string}-${string}-${string}-${string}-${string}`;

export type SessionCreationDetails = {
  inviterUuid: Uuid;
  inviteeUuid: Uuid;
};

export type SessionDetails = {
  invitee: {
    uuid: Uuid;
  };
  inviter: {
    uuid: Uuid;
  };
};

export interface SessionRepository {
  create: (sessionCreationDetails: SessionCreationDetails) => SessionDetails;
}

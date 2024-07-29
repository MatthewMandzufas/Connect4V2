type InviteCreationDetails = {
  inviter: String;
  invitee: String;
  exp: number;
};

type PersistedInvite = InviteCreationDetails & {
  uuid: String;
};

export interface InviteRepository {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<PersistedInvite>;
}

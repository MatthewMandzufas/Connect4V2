type InviteCreationDetails = {
  inviter: string;
  invitee: string;
  exp: number;
  status: InviteStatus;
  uuid?: Uuid;
};

type PersistedInvite = InviteCreationDetails & {
  uuid: Uuid;
};

interface InviteRepository {
  create: (
    inviteCreationDetails: InviteCreationDetails,
  ) => Promise<PersistedInvite>;
  loadInviteeInvites: (userEmail: string) => Promise<Array<PersistedInvite>>;
  getInviteDetails: (inviteUuid: Uuid) => Promise<PersistedInvite>;
  deleteInvite: (inviteUuid: Uuid) => Promise<{ isSuccess: boolean }>;
  acceptInvite: (inviteUuid: Uuid) => Promise<PersistedInvite>;
}

import { InviteStatus } from "./invite-service.d";

type InviteCreationDetails = {
  inviter: string;
  invitee: string;
  exp: number;
  status: InviteStatus;
};

type PersistedInvite = InviteCreationDetails & {
  uuid: string;
};

export interface InviteRepository {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<PersistedInvite>;
  loadInvites: (userEmail: string) => Promise<Array<PersistedInvite>>;
}

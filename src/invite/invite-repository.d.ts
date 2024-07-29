import { InviteStatus } from "./invite-service.d";

type InviteCreationDetails = {
  inviter: String;
  invitee: String;
  exp: number;
  status: InviteStatus;
};

type PersistedInvite = InviteCreationDetails & {
  uuid: String;
};

export interface InviteRepository {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<PersistedInvite>;
}

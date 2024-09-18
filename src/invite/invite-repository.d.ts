import { Uuid } from "@/global";
import { InviteStatus } from "./invite-service.d";

type InviteCreationDetails = {
  inviter: string;
  invitee: string;
  exp: number;
  status: InviteStatus;
};

type PersistedInvite = InviteCreationDetails & {
  uuid: Uuid;
};

export interface InviteRepository {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<PersistedInvite>;
  loadInviteeInvites: (userEmail: string) => Promise<Array<PersistedInvite>>;
  getInviteDetails: (inviteUuid: Uuid) => Promise<PersistedInvite>;
  deleteInvite: (inviteUuid: Uuid) => Promise<{ isSuccess: boolean }>;
}

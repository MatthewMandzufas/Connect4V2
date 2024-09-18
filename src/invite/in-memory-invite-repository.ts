import { Uuid } from "@/global";
import {
  InviteCreationDetails,
  InviteRepository,
  PersistedInvite,
} from "./invite-repository";

export default class InMemoryInviteRepository implements InviteRepository {
  private invites: Map<string, PersistedInvite>;

  constructor() {
    this.invites = new Map();
  }

  async create(inviteCreationDetails: InviteCreationDetails) {
    const { inviter, invitee, exp, status } = inviteCreationDetails;
    const uuid = crypto.randomUUID();
    this.invites.set(uuid, { inviter, invitee, exp, uuid, status });
    return Promise.resolve({
      inviter,
      invitee,
      exp,
      status,
      uuid,
    });
  }

  async loadInviteeInvites(inviteeEmail: string) {
    return Array.from(this.invites.values()).filter(
      (invite) => invite.invitee === inviteeEmail
    );
  }

  async getInviteDetails(inviteUuid: Uuid) {
    return this.invites.get(inviteUuid);
  }
}

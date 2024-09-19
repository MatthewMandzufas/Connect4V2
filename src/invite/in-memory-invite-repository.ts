import { Uuid } from "@/global";
import {
  InviteCreationDetails,
  InviteRepository,
  PersistedInvite,
} from "./invite-repository";
import { InviteStatus } from "./invite-service.d";

export default class InMemoryInviteRepository implements InviteRepository {
  private invites: Map<string, PersistedInvite>;

  constructor() {
    this.invites = new Map();
  }

  async create(inviteCreationDetails: InviteCreationDetails) {
    const {
      inviter,
      invitee,
      exp,
      status,
      uuid = crypto.randomUUID(),
    } = inviteCreationDetails;
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

  async deleteInvite(inviteUuid: Uuid) {
    this.invites.delete(inviteUuid);
    return {
      isSuccess: true,
    };
  }

  async acceptInvite(inviteUuid: Uuid) {
    const inviteDetails = await this.getInviteDetails(inviteUuid);
    const acceptedInviteDetails = {
      ...inviteDetails,
      status: InviteStatus.ACCEPTED,
    };
    await this.create(acceptedInviteDetails);
    return acceptedInviteDetails;
  }
}

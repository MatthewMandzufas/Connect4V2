import {
  InviteEvents,
  InviteServiceEventPublishers,
  InviteStatus,
  type InviteCreationDetails,
  type InviteDetails,
} from "@/invite/invite-service.d";
import UserService from "@/user/user-service";
import InMemoryInviteRepository from "./in-memory-invite-repository";
import { InviteRepository } from "./invite-repository";
interface InviteServiceInterface {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<InviteDetails>;
  getInvitesReceivedByUser: (
    inviterEmail: string
  ) => Promise<Array<InviteDetails>>;
}

export class InvalidInvitationError extends Error {}

const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;

class InviteService implements InviteServiceInterface {
  #userService: UserService;
  #inviteRepository: InviteRepository;
  #eventPublishers: InviteServiceEventPublishers;

  constructor(
    userService: UserService,
    inviteRepository: InviteRepository = new InMemoryInviteRepository(),
    eventPublishers: InviteServiceEventPublishers
  ) {
    this.#userService = userService;
    this.#inviteRepository = inviteRepository;
    this.#eventPublishers = eventPublishers;
  }

  async getInvitesReceivedByUser(inviteeEmail: string) {
    return await this.#inviteRepository.loadInviteeInvites(inviteeEmail);
  }

  async create(inviteCreationDetails: InviteCreationDetails) {
    const { inviter, invitee } = inviteCreationDetails;
    if (inviter === invitee) {
      throw new InvalidInvitationError(
        "Users cannot send invites to themselves"
      );
    }
    const inviteeDoesNotExist = !(await this.#userService.getDoesUserExist(
      invitee
    ));
    if (inviteeDoesNotExist) {
      throw new InvalidInvitationError("Invitee does not exist");
    }

    const exp = Date.now() + lengthOfDayInMilliseconds;
    const { uuid, status } = await this.#inviteRepository.create({
      exp,
      status: InviteStatus.PENDING,
      ...inviteCreationDetails,
    });
    const inviteDetails = { uuid, inviter, invitee, exp, status };
    await this.#eventPublishers[InviteEvents.INVITATION_CREATED](inviteDetails);

    return inviteDetails;
  }
}

export default InviteService;

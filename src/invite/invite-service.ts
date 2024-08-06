import {
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
  getUsersInvites: (userEmail: string) => Promise<InviteDetails>;
}

export class InvalidInvitationError extends Error {}

const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;

class InviteService implements InviteServiceInterface {
  #userService: UserService;
  #inviteRepository: InviteRepository;

  constructor(
    userService: UserService,
    inviteRepository: InviteRepository = new InMemoryInviteRepository()
  ) {
    this.#userService = userService;
    this.#inviteRepository = inviteRepository;
  }

  async getUsersInvites(inviteUuid: string) {
    return await this.#inviteRepository.loadInvites(inviteUuid);
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

    return {
      uuid,
      inviter,
      invitee,
      exp,
      status,
    };
  }
}

export default InviteService;

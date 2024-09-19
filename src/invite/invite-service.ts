import { Uuid } from "@/global";
import {
  InviteEvents,
  InviteServiceEventPublishers,
  InviteStatus,
  type InviteCreationDetails,
  type InviteDetails,
} from "@/invite/invite-service.d";
import SessionService from "@/session/session-service";
import UserService from "@/user/user-service";
import { InvalidInvitationError } from "./errors";
import InMemoryInviteRepository from "./in-memory-invite-repository";
import { InviteRepository } from "./invite-repository";
interface InviteServiceInterface {
  create: (
    inviteCreationDetails: InviteCreationDetails
  ) => Promise<InviteDetails>;
  getInvitesReceivedByUser: (
    inviterEmail: string
  ) => Promise<Array<InviteDetails>>;
  acceptInvite: (inviteUuid: Uuid) => Promise<Uuid>;
  getInvite: (inviteUuid: Uuid) => Promise<InviteDetails>;
}

const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;

class InviteService implements InviteServiceInterface {
  #userService: UserService;
  #inviteRepository: InviteRepository;
  #eventPublishers: InviteServiceEventPublishers;
  #sessionService: SessionService;

  constructor(
    userService: UserService,
    inviteRepository: InviteRepository = new InMemoryInviteRepository(),
    eventPublishers: InviteServiceEventPublishers,
    sessionService: SessionService
  ) {
    this.#userService = userService;
    this.#inviteRepository = inviteRepository;
    this.#eventPublishers = eventPublishers;
    this.#sessionService = sessionService;
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

  async acceptInvite(inviteUuid: Uuid) {
    const inviteDetails = await this.#inviteRepository.getInviteDetails(
      inviteUuid
    );

    const inviteeDetails = await this.#userService.getUserDetails(
      inviteDetails.invitee
    );
    const inviterDetails = await this.#userService.getUserDetails(
      inviteDetails.inviter
    );
    const sessionCreationDetails = {
      inviteeUuid: inviteeDetails.uuid,
      inviterUuid: inviterDetails.uuid,
    };
    const sessionDetails = await this.#sessionService.createSession(
      sessionCreationDetails
    );

    await this.#inviteRepository.acceptInvite(inviteUuid);
    return sessionDetails.uuid;
  }

  async getInvite(inviteUuid: Uuid) {
    return this.#inviteRepository.getInviteDetails(inviteUuid);
  }
}

export default InviteService;

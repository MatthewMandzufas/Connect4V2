import {
  InviteStatus,
  type InviteCreationDetails,
  type InviteDetails,
} from "@/invite/invite-service.d";
import UserService from "@/user/user-service";
import { InviteRepository } from "./invite-repository";
interface InviteServiceInterface {
  create: (inviteCreationDetails: InviteCreationDetails) => InviteDetails;
}

const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;

class InviteService implements InviteServiceInterface {
  #userService: UserService;
  #inviteRepository: InviteRepository;

  constructor(userService: UserService, inviteRepository: InviteRepository) {
    this.#userService = userService;
    this.#inviteRepository = inviteRepository;
  }

  create({ invitee, inviter }: InviteCreationDetails) {
    const uuid = crypto.randomUUID();
    const exp = Date.now() + lengthOfDayInMilliseconds;

    return {
      uuid,
      exp,
      inviter,
      invitee,
      status: InviteStatus.PENDING,
    };
  }
}

export default InviteService;

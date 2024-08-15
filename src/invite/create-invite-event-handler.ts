import {
  InviteDetails,
  InviteEvents,
  InviteServiceEventHandlers,
} from "./invite-service.d";

const createInviteEventHandlers = (
  eventPublisher: (queue: string, payload: unknown) => Promise<unknown>
): InviteServiceEventHandlers => {
  return {
    [InviteEvents.INVITATION_CREATED]: (inviteDetails: InviteDetails) =>
      eventPublisher("invite_created", inviteDetails),
  };
};

export default createInviteEventHandlers;

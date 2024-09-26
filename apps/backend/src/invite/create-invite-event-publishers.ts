import { InviteCreatedEvent } from "./create-invite-event-listener";
import { InviteEvents } from "./invite-service";

const createInviteEventPublishers = (
  eventPublisher: (eventDetails: InviteCreatedEvent) => Promise<unknown>,
): InviteServiceEventPublishers => {
  return {
    [InviteEvents.INVITATION_CREATED]: (inviteDetails: InviteDetails) =>
      eventPublisher({
        type: InviteEvents.INVITATION_CREATED,
        payload: inviteDetails,
      }),
  };
};

export default createInviteEventPublishers;

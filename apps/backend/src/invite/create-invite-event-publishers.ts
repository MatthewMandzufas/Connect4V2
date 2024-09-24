import {
  InviteDetails,
  InviteEvents,
  InviteServiceEventPublishers,
} from "@/invite/invite-service.d";
import { InviteCreatedEvent } from "./create-invite-event-listener";

const createInviteEventPublishers = (
  eventPublisher: (eventDetails: InviteCreatedEvent) => Promise<unknown>
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

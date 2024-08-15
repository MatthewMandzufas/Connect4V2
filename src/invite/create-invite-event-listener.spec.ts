import { Subject } from "rxjs";
import { InviteDetails, InviteEvents, InviteStatus } from "./invite-service.d";

type InviteCreatedEvent = {
  type: InviteEvents.INVITATION_CREATED;
  payload: InviteDetails;
};
describe(`create-invite-event-listener`, () => {
  describe(`given an event subscription`, () => {
    describe(`and a invitee notification function`, () => {
      describe(`when an invite is sent`, () => {
        it(`notifies the invitee`, () => {
          const subscription = new Subject<InviteCreatedEvent>();
          const notificationFn = jest.fn();
          createInviteEventListener(subscription, notificationFn);

          subscription.next({
            type: InviteEvents.INVITATION_CREATED,
            payload: {
              inviter: "inviter@email.com",
              invitee: "some@email.com",
              exp: Date.now(),
              uuid: crypto.randomUUID(),
              status: InviteStatus.PENDING,
            },
          });

          expect(notificationFn).toHaveBeenCalledWith({
            recipient: "some@email.com",
            payload: {
              inviter: "inviter@email.com",
              invitee: "some@email.com",
              exp: expect.any(Number),
              uuid: expect.toBeUUID(),
              status: InviteStatus.PENDING,
            },
          });
        });
      });
    });
  });
});

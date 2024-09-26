import createInviteEventPublishers from "./create-invite-event-publishers";
import { InviteEvents } from "./invite-service";

describe("create-invite-event-handler", () => {
  describe("given an event publisher", () => {
    it("creates one event handler for each invite service event", () => {
      const mockEventPublisher = jest.fn();
      const eventHandlers = createInviteEventPublishers(mockEventPublisher);
      expect(eventHandlers).toEqual({
        [InviteEvents.INVITATION_CREATED]: expect.any(Function),
      });
    });
  });
});

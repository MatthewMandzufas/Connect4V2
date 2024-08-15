import createInviteEventHandlers from "./create-invite-event-handlers";
import { InviteEvents } from "./invite-service.d";

describe("create-invite-event-handler", () => {
  describe("given an event publisher", () => {
    it("creates one event handler for each invite service event", () => {
      const mockEventPublisher = jest.fn();
      const eventHandlers = createInviteEventHandlers(mockEventPublisher);
      expect(eventHandlers).toEqual({
        [InviteEvents.INVITATION_CREATED]: expect.any(Function),
      });
    });
  });
});

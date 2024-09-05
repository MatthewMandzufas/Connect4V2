import InMemorySessionRepository from "./in-memory-session-repository";
import { SessionCreationDetails } from "./session-service.d";

describe("in-memory-session-repository", () => {
  const inMemorySessionRepository = new InMemorySessionRepository();
  describe("given details about a session", () => {
    it("creates the session", () => {
      const sessionDetails: SessionCreationDetails = {
        inviterUuid: "e4e363be-7418-463b-ad5b-21b97a7862d3",
        inviteeUuid: "7d9bdeb5-a159-4b61-ad42-948d73ff5574",
      };

      const createdSession = inMemorySessionRepository.create(sessionDetails);
      expect(createdSession).toEqual(
        expect.objectContaining({
          inviter: expect.objectContaining({
            uuid: "e4e363be-7418-463b-ad5b-21b97a7862d3",
          }),
          invitee: expect.objectContaining({
            uuid: "7d9bdeb5-a159-4b61-ad42-948d73ff5574",
          }),
        })
      );
    });
  });
});

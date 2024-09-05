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
          uuid: expect.toBeUUID(),
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
  describe("given a session has been created", () => {
    it("retrieves the session", () => {
      const sessionDetails: SessionCreationDetails = {
        inviterUuid: "dcc3163b-d579-485b-b856-61c13de9770a",
        inviteeUuid: "8d7bd04e-33ff-4b5a-bb37-12ee36e77a77",
      };

      const sessionUuid = inMemorySessionRepository.create(sessionDetails).uuid;
      const retrievedSession =
        inMemorySessionRepository.getSession(sessionUuid);
      expect(retrievedSession).toEqual(
        expect.objectContaining({
          uuid: sessionUuid,
          inviter: expect.objectContaining({
            uuid: "dcc3163b-d579-485b-b856-61c13de9770a",
          }),
          invitee: expect.objectContaining({
            uuid: "8d7bd04e-33ff-4b5a-bb37-12ee36e77a77",
          }),
        })
      );
    });
  });
});

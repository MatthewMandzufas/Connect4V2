import InMemorySessionRepository from "./in-memory-session-repository";

describe("in-memory-session-repository", () => {
  const inMemorySessionRepository = new InMemorySessionRepository();
  describe("given details about a session", () => {
    it("creates the session", async () => {
      const sessionDetails: SessionCreationDetails = {
        inviterUuid: "e4e363be-7418-463b-ad5b-21b97a7862d3",
        inviteeUuid: "7d9bdeb5-a159-4b61-ad42-948d73ff5574",
      };

      const createdSession =
        await inMemorySessionRepository.create(sessionDetails);
      expect(createdSession).toEqual(
        expect.objectContaining({
          uuid: expect.toBeUUID(),
          inviter: expect.objectContaining({
            uuid: "e4e363be-7418-463b-ad5b-21b97a7862d3",
          }),
          invitee: expect.objectContaining({
            uuid: "7d9bdeb5-a159-4b61-ad42-948d73ff5574",
          }),
          status: "IN_PROGRESS",
        }),
      );
    });
  });
  describe("given a session has been created", () => {
    it("retrieves the session", async () => {
      const sessionDetails: SessionCreationDetails = {
        inviterUuid: "dcc3163b-d579-485b-b856-61c13de9770a",
        inviteeUuid: "8d7bd04e-33ff-4b5a-bb37-12ee36e77a77",
      };

      const returnedSession =
        await inMemorySessionRepository.create(sessionDetails);

      const sessionUuid = returnedSession.uuid;
      const retrievedSession =
        await inMemorySessionRepository.getSession(sessionUuid);
      expect(retrievedSession).toEqual(
        expect.objectContaining({
          uuid: sessionUuid,
          inviter: expect.objectContaining({
            uuid: "dcc3163b-d579-485b-b856-61c13de9770a",
          }),
          invitee: expect.objectContaining({
            uuid: "8d7bd04e-33ff-4b5a-bb37-12ee36e77a77",
          }),
          status: "IN_PROGRESS",
        }),
      );
    });
  });
  describe("updating session details", () => {
    describe("given the id of an existing session", () => {
      describe("and the uuid of a game", () => {
        it("adds the game to the session details", async () => {
          const gameUuid = "6c5c6e3f-8a15-4199-8f46-4b929e6b6dfa";
          const { uuid: sessionUuid } = await inMemorySessionRepository.create({
            inviteeUuid: "6f7923a8-8998-4625-bf1c-ddefe949e0e6",
            inviterUuid: "5de4084a-96e0-48b0-8307-7c80165e707b",
          });
          await inMemorySessionRepository.addGame(
            sessionUuid,
            gameUuid,
            "6f7923a8-8998-4625-bf1c-ddefe949e0e6",
            "5de4084a-96e0-48b0-8307-7c80165e707b",
          );
          const sessionDetails =
            await inMemorySessionRepository.getSession(sessionUuid);
          expect(sessionDetails.games).toEqual([
            {
              gameUuid,
              playerOneUuid: "6f7923a8-8998-4625-bf1c-ddefe949e0e6",
              playerTwoUuid: "5de4084a-96e0-48b0-8307-7c80165e707b",
            },
          ]);
        });
      });
      describe("and the uuid of a game to set as active game", () => {
        it("sets the sessions active game", async () => {
          const gameUuid = "2133a74b-5c32-4c03-9742-cb5064e4d5cf";
          const { uuid: sessionUuid } = await inMemorySessionRepository.create({
            inviteeUuid: "a1dfad7b-8baa-4cef-af83-bacd4297eb31",
            inviterUuid: "5305e259-570c-4228-80dc-d3c8be07e3ce",
          });
          await inMemorySessionRepository.setActiveGame(sessionUuid, gameUuid);
          const sessionDetails =
            await inMemorySessionRepository.getSession(sessionUuid);
          expect(sessionDetails.activeGameUuid).toEqual(gameUuid);
        });
      });
    });
  });
});

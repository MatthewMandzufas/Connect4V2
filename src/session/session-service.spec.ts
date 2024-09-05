import InMemorySessionRepository from "./in-memory-session-repository";
import SessionService from "./session-service";

describe("session-service", () => {
  let sessionRepository: InMemorySessionRepository;
  let sessionService: SessionService;
  beforeEach(() => {
    sessionRepository = new InMemorySessionRepository();
    sessionService = new SessionService(sessionRepository);
  });

  describe("creating a session service", () => {
    describe("given a session repository", () => {
      it("creates a session service", () => {
        expect(sessionService).toBeInstanceOf(SessionService);
      });
    });
  });
  describe("creating a session", () => {
    describe("given the identities of two players", () => {
      it("creates a session", async () => {
        const sessionDetails = await sessionService.createSession({
          inviterUuid: "004be48d-d024-40b7-9b9e-e692adbd45ea",
          inviteeUuid: "53d13d08-6d6f-4d62-8753-52a91cc7b52e",
        });
        expect(sessionDetails).toEqual(
          expect.objectContaining({
            uuid: expect.toBeUUID(),
            inviter: expect.objectContaining({
              uuid: "004be48d-d024-40b7-9b9e-e692adbd45ea",
            }),
            invitee: expect.objectContaining({
              uuid: "53d13d08-6d6f-4d62-8753-52a91cc7b52e",
            }),
          })
        );
      });
    });
  });
  describe.skip("retrieving a session", () => {
    describe("given a session has been created", () => {
      describe("when provided with the id", () => {
        it("retrieves details about the session", () => {});
      });
    });
  });
});

describe("in-memory-session-repository", () => {
  const inMemorySessionRepository = new InMemorySessionRepository();
  describe("given details about a session", () => {
    it("creates the session", () => {
      const sessionDetails = {
        inviterUuid: "bob",
        inviteeUuid: "alice",
      };

      const createdSession = inMemorySessionRepository.create(sessionDetails);
      expect(createdSession).toEqual(
        expect.objectContaining({
          inviter: expect.objectContaining({
            uuid: "bob",
          }),
          invitee: expect.objectContaining({
            uuid: "alice",
          }),
        })
      );
    });
  });
});

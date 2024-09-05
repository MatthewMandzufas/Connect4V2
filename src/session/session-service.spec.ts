describe("session-service", () => {
  describe("creating a session", () => {
    describe("given the identities of two players", () => {
      it("creates a session", () => {
        const sessionId = sessionService.createSession({
          inviterUuid: "bob",
          inviteeUuid: "alice",
        });
        expect(sessionService.getSession(sessionId)).toEqual(
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
  describe.skip("retrieving a session", () => {
    describe("given a session has been created", () => {
      describe("when provided with the id", () => {
        it("retrieves details about the session", () => {});
      });
    });
  });
});
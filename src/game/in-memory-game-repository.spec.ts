describe("in-memory-repository", () => {
  describe("given defaults", () => {
    it("creates an in memory repository", () => {
      const repository = new InMemoryGameRepository();
      expect(repository).toBeInstanceOf(InMemoryGameRepository);
    });
  });
});

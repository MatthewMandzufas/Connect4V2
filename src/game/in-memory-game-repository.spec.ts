import InMemoryGameRepository from "./in-memory-game-repository";

describe("in-memory-game-repository", () => {
  describe("creating a game repository", () => {
    describe("given no arguments", () => {
      it("creates an in memory game repository", () => {
        const repository = new InMemoryGameRepository();
        expect(repository).toBeInstanceOf(InMemoryGameRepository);
      });
    });
  });
});

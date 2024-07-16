import toBeUUID from "@/to-Be-UUID";
import InMemoryUserRepository from "@/user/in-memory-user-repository";

expect.extend({
  toBeUUID,
});

describe("in-memory-user-repository", () => {
  describe("given the details for a user who does not exist", () => {
    it("creates a user", async () => {
      const inMemoryUserRepository = new InMemoryUserRepository();
      const createdUser = await inMemoryUserRepository.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
      });

      expect(createdUser).toEqual(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          uuid: expect.toBeUUID(),
        })
      );
    });
  });
  describe("given an email", () => {
    it("returns a list of associated users", async () => {
      const johnDoeUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
      };

      const inMemoryUserRepository = new InMemoryUserRepository();
      await inMemoryUserRepository.create(johnDoeUser);
      await inMemoryUserRepository.create({
        firstName: "Jeff",
        lastName: "Goldblum",
        email: "jeff.goldblum@email.com",
      });

      expect(
        await inMemoryUserRepository.findByEmail(johnDoeUser.email)
      ).toEqual([
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
        }),
      ]);
    });
  });
});

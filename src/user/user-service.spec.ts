import UserService from "@/user-service";
import InMemoryUserRepositoryFactory from "./in-memory-user-repository";

describe("user-service", () => {
  describe("given the details of a user that does not exist", () => {
    it("creates the user", async () => {
      const inMemoryUserRepository = new InMemoryUserRepositoryFactory();
      const userService = new UserService(inMemoryUserRepository);
      const user = await userService.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
      });
      expect(user).toEqual(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          uuid: expect.toBeUUID(),
        })
      );
    });
  });
});

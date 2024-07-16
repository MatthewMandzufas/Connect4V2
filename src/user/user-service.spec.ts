import UserService from "@/user/user-service";
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
  describe("given the email of a user that already exists", () => {
    it('throws a "user already exists" error', async () => {
      const userRepository = new InMemoryUserRepositoryFactory();
      const userService = new UserService(userRepository);
      const johnDoeUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
      };

      await userService.create(johnDoeUser);
      expect(await userService.create(johnDoeUser)).toThrow(
        new UserAlreadyExistsError("A user with that email already exists")
      );
    });
  });
});

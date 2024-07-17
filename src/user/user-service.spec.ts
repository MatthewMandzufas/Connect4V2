import UserService, { UserAlreadyExistsError } from "@/user/user-service";
import argon2 from "argon2";
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
        password: "somePassword!",
      });
      expect(user).toEqual(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          uuid: expect.toBeUUID(),
        })
      );
      expect(await argon2.hash(user.password)).toBeTruthy();
    });
  });
  describe("given the email of a user that already exists", () => {
    it('throws a "user already exists" error', async () => {
      const userRepository = new InMemoryUserRepositoryFactory();
      const userService = new UserService(userRepository);
      const johnDoeUser = {
        firstName: "John1",
        lastName: "Doe",
        email: "john1.doe@email.com",
        password: "somePassword",
      };

      await userService.create(johnDoeUser);
      expect(userService.create(johnDoeUser)).rejects.toThrow(
        new UserAlreadyExistsError("A user with that email already exists")
      );
    });
  });
  describe("given a user with a plaintext password", () => {
    it("creates the user with a hashed password", async () => {
      const userRepository = new InMemoryUserRepositoryFactory();
      const userService = new UserService(userRepository);
      const JoshKennedyUser = {
        firstName: "Josh",
        lastName: "Kennedy",
        email: "Josh.Kennedy@email.com",
        password: "Hello123",
      };
      const user = await userService.create(JoshKennedyUser);
      expect(await argon2.hash(user.password)).toBeTruthy();
    });
  });
});

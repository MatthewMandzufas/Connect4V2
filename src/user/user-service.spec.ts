import UserService, { UserAlreadyExistsError } from "@/user/user-service";
import InMemoryUserRepositoryFactory from "./in-memory-user-repository";

import argon2 from "argon2";

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
        firstName: "John1",
        lastName: "Doe",
        email: "john1.doe@email.com",
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
      const hashedPassword = await argon2.hash("Hello123");
      expect(user.password).toEqual(hashedPassword);
    });
  });
});

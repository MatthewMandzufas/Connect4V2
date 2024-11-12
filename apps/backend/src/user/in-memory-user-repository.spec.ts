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
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$42OHhoG0FCA+xCPt5PppZQ$XAk4t8UkXR2WFuGdU5EDTXB7/dtdzpmlHQODWOzsa6E",
      });

      expect(createdUser).toEqual(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          uuid: expect.toBeUUID(),
        }),
      );
    });
  });
  describe("given an email", () => {
    it("returns a list of associated users", async () => {
      const johnDoeUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$42OHhoG0FCA+xCPt5PppZQ$XAk4t8UkXR2WFuGdU5EDTXB7/dtdzpmlHQODWOzsa6E",
      };

      const inMemoryUserRepository = new InMemoryUserRepository();
      await inMemoryUserRepository.create(johnDoeUser);
      await inMemoryUserRepository.create({
        firstName: "Jeff",
        lastName: "Goldblum",
        email: "jeff.goldblum@email.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$42OHhoG0FCA+xCPt5PppZQ$XAk4t8UkXR2WFuGdU5EDTXB7/dtdzpmlHQODWOzsa6E",
      });

      expect(
        await inMemoryUserRepository.findByEmail(johnDoeUser.email),
      ).toEqual([
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
        }),
      ]);
    });
    it("deletes a user", async () => {
      const inMemoryUserRepository = new InMemoryUserRepository();
      const createdUser = await inMemoryUserRepository.create({
        firstName: "some",
        lastName: "user",
        email: "222@email.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$42OHhoG0FCA+xCPt5PppZQ$XAk4t8UkXR2WFuGdU5EDTXB7/dtdzpmlHQODWOzsa6E",
      });
      expect(await inMemoryUserRepository.delete(createdUser.email)).toEqual({
        isSuccess: true,
      });
    });
  });
  describe("given a uuid", () => {
    it("returns the user details", async () => {
      const johnDoeUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$42OHhoG0FCA+xCPt5PppZQ$XAk4t8UkXR2WFuGdU5EDTXB7/dtdzpmlHQODWOzsa6E",
      };

      const inMemoryUserRepository = new InMemoryUserRepository();
      const { uuid } = await inMemoryUserRepository.create(johnDoeUser);
      expect(await inMemoryUserRepository.findByUuid(uuid)).toEqual({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        uuid: expect.toBeUUID(),
        password: expect.any(String),
      });
    });
  });
});

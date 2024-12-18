import InMemoryUserRepository from "@/user/in-memory-user-repository";
import UserService from "@/user/user-service";
import crypto from "crypto";

import {
  AuthenticationFailedError,
  NoSuchUserError,
  UserAlreadyExistsError,
} from "./errors";

const user1Details = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@foo.com",
  password: "iamjohndoe",
};

async function verify(password: string, hash): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}

describe("user-service", () => {
  describe("user creation", () => {
    describe("given the details of a user that doesn't exist", () => {
      it("creates the user", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        expect(await userService.create(user1Details)).toEqual(
          expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@foo.com",
            uuid: expect.toBeUUID(),
          }),
        );
      });
    });
    describe("given an email is already associated with an existing user", () => {
      it("throws a 'user already exists' error when attempting to create users with the same email", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        await userService.create(user1Details);
        expect(userService.create(user1Details)).rejects.toThrow(
          new UserAlreadyExistsError("A user with that email already exists"),
        );
      });
    });
    describe("given a user with a plain-text password", () => {
      it("creates the user with a hashed password", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userDetails = {
          firstName: "Osamu",
          lastName: "Dazai",
          email: "od@nlh.jp",
          password: "nolongerhuman",
        };
        await userService.create(userDetails);
        const [{ password: hashedPassword }] = await userRepository.findByEmail(
          userDetails.email,
        );
        expect(await verify(userDetails.password, hashedPassword)).toBeTruthy();
      });
    });
  });

  describe("user deletion", () => {
    describe("given an email associated with an existing user", () => {
      it("deletes the user", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userDetails = {
          firstName: "realUser",
          lastName: "deletedSoon",
          email: "email@email.com",
          password: "shortpassword",
        };
        await userService.create(userDetails);
        const deletionResult = await userService.delete(userDetails.email);

        expect(deletionResult).toEqual({ isSuccess: true });
        expect(await userRepository.findByEmail(userDetails.email)).toEqual([]);
      });
    });
    describe("given an email for a user that does not exists", () => {
      it("does nothing and returns isSuccess false", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userDetails = {
          firstName: "Raymond",
          lastName: "Holt",
          email: "raymond@email.com",
          password: "captain",
        };
        const deletionResult = await userService.delete(userDetails.email);
        expect(deletionResult).toEqual({ isSuccess: false });
      });
    });
  });

  describe("user authentication", () => {
    describe("given a registered user", () => {
      describe("when an authentication attempt for that user is made with invalid credentials", () => {
        it("throws a 'Authentication failed' error", async () => {
          const userRepository = new InMemoryUserRepository();
          const userService = new UserService(userRepository);
          const userDetails = {
            firstName: "Fernando",
            lastName: "Pessoa",
            email: "tbod@book.com",
            password: "oaisdhfgoishdfg",
          };
          await userService.create(userDetails);
          const userCredentials = {
            email: "tbod@book.com",
            password: "wrongpasswordlmao",
          };
          expect(userService.authenticate(userCredentials)).rejects.toThrow(
            new AuthenticationFailedError("Authentication failed"),
          );
        });
      });
      describe("when an authentication attempt for that user is made with valid credentials", () => {
        it("returns a message indicating the user was authenticated", async () => {
          const userRepository = new InMemoryUserRepository();
          const userService = new UserService(userRepository);
          const userDetails = {
            firstName: "William",
            lastName: "Faulkner",
            email: "wf@gmail.com",
            password: "dhfgkjhsdfkljghlksdfhg",
          };
          await userService.create(userDetails);
          const userCredentials = {
            email: "wf@gmail.com",
            password: "dhfgkjhsdfkljghlksdfhg",
          };
          await expect(
            userService.authenticate(userCredentials),
          ).resolves.toEqual({
            message: "Authentication succeeded",
          });
        });
      });
    });
    describe("given an unregistered user", () => {
      describe("when an authentication attempt is made", () => {
        it("throws an 'Authentication failed' error", () => {
          const userRepository = new InMemoryUserRepository();
          const userService = new UserService(userRepository);
          const userCredentials = {
            email: "aldhux@bnw.com",
            password: "lidfhglksdhfglkjhsdlkfjhgkl",
          };
          expect(userService.authenticate(userCredentials)).rejects.toThrow(
            new AuthenticationFailedError("Authentication failed"),
          );
        });
      });
    });
  });

  describe("get user details", () => {
    describe("given the email for a user does not exist", () => {
      it("throws a 'NoSuchUser' error", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userEmail = "Tim.Kelley@email.com";

        expect(userService.getUserDetails(userEmail)).rejects.toThrow(
          new NoSuchUserError("User does not exist"),
        );
      });
    });

    describe("given the email for a user that exist", () => {
      it("it returns the user's details", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userSignupDetails = {
          firstName: "Patrick",
          lastName: "Lipinski",
          email: "PL@email.com",
          password: "kasdlkajsdlkajsd",
        };
        await userService.create(userSignupDetails);

        await expect(
          userService.getUserDetails(userSignupDetails.email),
        ).resolves.toEqual({
          firstName: "Patrick",
          lastName: "Lipinski",
          email: "PL@email.com",
          uuid: expect.toBeUUID(),
        });
      });
    });
    describe("given the uuid for a user that does exist", () => {
      it("returns the users details", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userSignupDetails = {
          firstName: "Patrick",
          lastName: "Lipinski",
          email: "PL@email.com",
          password: "kasdlkajsdlkajsd",
        };
        const { uuid } = await userService.create(userSignupDetails);

        await expect(userService.getUserDetailsByUuid(uuid)).resolves.toEqual({
          firstName: "Patrick",
          lastName: "Lipinski",
          email: "PL@email.com",
          uuid: expect.toBeUUID(),
        });
      });
    });
  });
  describe("check user exists", () => {
    describe("given the email of an existing user", () => {
      it("returns true", async () => {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(userRepository);
        const userSignupDetails = {
          firstName: "Jeff",
          lastName: "Bezos",
          email: "Jeff.Bezos@email.com",
          password: "kasdlkajsdlkajsd",
        };
        await userService.create(userSignupDetails);
        await expect(
          userService.getDoesUserExist("Jeff.Bezos@email.com"),
        ).resolves.toBe(true);
      });
    });
  });
});

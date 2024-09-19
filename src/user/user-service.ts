import { Uuid } from "@/global";
import type {
  UserCredentials,
  UserDetails,
  UserRepository,
  UserSignupDetails,
} from "@/user/user-repository.d";
import argon2, { hash } from "argon2";
import { isEmpty } from "ramda";
import {
  AuthenticationFailedError,
  NoSuchUserError,
  UserAlreadyExistsError,
} from "./errors";

interface UserServiceInterface {
  create: (
    userDetails: UserSignupDetails
  ) => Promise<UserSignupDetails & { uuid: Uuid }>;
  authenticate: (
    userCredentials: UserCredentials
  ) => Promise<{ message: string }>;
  getUserDetails: (userEmail: string) => Promise<UserDetails>;
  getDoesUserExist: (userEmail: string) => Promise<boolean>;
  getUserDetailsByUuid: (userUuid: Uuid) => Promise<UserDetails>;
}

class UserService implements UserServiceInterface {
  #userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository;
  }

  async create(userDetails: UserSignupDetails) {
    if (isEmpty(await this.#userRepository.findByEmail(userDetails.email))) {
      return await this.#userRepository.create({
        ...userDetails,
        password: await hash(userDetails.password),
      });
    } else {
      throw new UserAlreadyExistsError("A user with that email already exists");
    }
  }

  async authenticate({ email, password }: UserCredentials) {
    const usersWithProvidedEmail = await this.#userRepository.findByEmail(
      email
    );
    const userDetails = usersWithProvidedEmail[0];
    if (userDetails === undefined) {
      throw new AuthenticationFailedError("Authentication failed");
    }
    const isInvalidPassword = !(await argon2.verify(
      userDetails.password,
      password
    ));
    if (isInvalidPassword) {
      throw new AuthenticationFailedError("Authentication failed");
    }
    return {
      message: "Authentication succeeded",
    };
  }

  async getDoesUserExist(userEmail: string) {
    const persistedUsersWithProvidedEmail =
      await this.#userRepository.findByEmail(userEmail);
    return persistedUsersWithProvidedEmail.length !== 0;
  }

  async getUserDetails(userEmail: string) {
    const persistedUsersWithProvidedEmail =
      await this.#userRepository.findByEmail(userEmail);
    const persistedUser = persistedUsersWithProvidedEmail[0];
    if (persistedUser === undefined) {
      throw new NoSuchUserError("User does not exist");
    }
    const { password, ...userDetails } = persistedUser;
    return userDetails;
  }

  async getUserDetailsByUuid(userUuid: Uuid) {
    const persistedUsersWithProvidedUuid =
      await this.#userRepository.findByUuid(userUuid);
    const persistedUser = persistedUsersWithProvidedUuid[0];
    if (persistedUser === undefined) {
      throw new NoSuchUserError("User does not exist");
    }
    const { password, ...userDetails } = persistedUser;
    return userDetails;
  }
}

export default UserService;

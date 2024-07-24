import type {
  UserCredentials,
  UserDetails,
  UserRepository,
  UserSignupDetails,
} from "@/user/user-repository.d";
import argon2, { hash } from "argon2";
import { isEmpty } from "ramda";
export class UserAlreadyExistsError extends Error {}
export class AuthenticationFailedError extends Error {}
export class NoSuchUserError extends Error {}

interface UserServiceInterface {
  create: (
    userDetails: UserSignupDetails
  ) => Promise<UserSignupDetails & { uuid: Uuid }>;
  authenticate: (
    userCredentials: UserCredentials
  ) => Promise<{ message: String }>;
  getUserDetails: (userEmail: string) => Promise<UserDetails>;
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

  async getUserDetails(userEmail: string) {
    const persistedUsersWithProvidedEmail =
      await this.#userRepository.findByEmail(userEmail);
    const persistedUser = persistedUsersWithProvidedEmail[0];
    if (persistedUser === undefined) {
      throw new NoSuchUserError("User does not exist");
    }
    const { password, uuid, ...userDetails } = persistedUser;
    return userDetails;
  }
}

export default UserService;

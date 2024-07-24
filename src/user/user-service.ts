import type {
  UserCredentials,
  UserDetails,
  UserRepository,
} from "@/user/user-repository.d";
import argon2, { hash } from "argon2";
import { isEmpty } from "ramda";
export class UserAlreadyExistsError extends Error {}
export class AuthenticationFailedError extends Error {}

interface UserServiceInterface {
  create: (userDetails: UserDetails) => Promise<UserDetails & { uuid: Uuid }>;
  authenticate: (
    userCredentials: UserCredentials
  ) => Promise<{ message: String }>;
}

class UserService implements UserServiceInterface {
  #userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository;
  }

  async create(userDetails: UserDetails) {
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
}

export default UserService;

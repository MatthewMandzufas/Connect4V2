import crypto from "crypto";
import { isEmpty } from "ramda";
import {
  AuthenticationFailedError,
  NoSuchUserError,
  UserAlreadyExistsError,
} from "./errors";

interface UserServiceInterface {
  create: (
    userDetails: UserSignupDetails,
  ) => Promise<UserSignupDetails & { uuid: Uuid }>;
  delete: (userEmail: string) => Promise<{ isSuccess: boolean }>;
  authenticate: (
    userCredentials: UserCredentials,
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

  async hash(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(8).toString("hex");

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ":" + derivedKey.toString("hex"));
      });
    });
  }

  async verify(password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString("hex"));
      });
    });
  }

  async create(userDetails: UserSignupDetails) {
    if (isEmpty(await this.#userRepository.findByEmail(userDetails.email))) {
      const password = (await this.hash(userDetails.password)) as string;
      const user = await this.#userRepository.create({
        ...userDetails,
        password,
      });
      return user;
    } else {
      throw new UserAlreadyExistsError("A user with that email already exists");
    }
  }

  async authenticate({ email, password }: UserCredentials) {
    const usersWithProvidedEmail =
      await this.#userRepository.findByEmail(email);
    const userDetails = usersWithProvidedEmail[0];
    if (userDetails === undefined) {
      throw new AuthenticationFailedError("Authentication failed");
    }
    const isValidPassword = await this.verify(password, userDetails.password);
    if (!isValidPassword) {
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
    const persistedUser = await this.#userRepository.findByUuid(userUuid);
    if (persistedUser === undefined) {
      throw new NoSuchUserError("User does not exist");
    }
    const { password, ...userDetails } = persistedUser;
    return userDetails;
  }

  async delete(userEmail: string) {
    return await this.#userRepository.delete(userEmail);
  }
}

export default UserService;

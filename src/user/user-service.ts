import InMemoryUserRepositoryFactory, {
  PersistedUser,
} from "./in-memory-user-repository";
import { CreateUserParams, UserRepository } from "./user-repository";

interface UserServiceInterface {
  create: (userDetails: CreateUserParams) => Promise<PersistedUser>;
}

export default class UserService implements UserServiceInterface {
  #userRepository: UserRepository;

  constructor(userRepository: InMemoryUserRepositoryFactory) {
    this.#userRepository = userRepository;
  }

  async create(userDetails: CreateUserParams) {
    return await this.#userRepository.create(userDetails);
  }
}

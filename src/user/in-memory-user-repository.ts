import { CreateUserParams } from "./user-repository";

export type PersistedUser = {
  firstName: string;
  lastName: string;
  email: string;
  uuid: `${string}-${string}-${string}-${string}-${string}`;
};

export interface InMemoryUserRepository {
  create: (user: CreateUserParams) => Promise<PersistedUser>;
}

export default class InMemoryUserRepositoryFactory
  implements InMemoryUserRepository
{
  private users;

  constructor() {
    this.users = new Map();
  }

  async create(user) {
    const { firstName, lastName, email } = user;
    const uuid = crypto.randomUUID();
    await this.users.set(uuid, { firstName, lastName, email });
    return Promise.resolve({
      firstName,
      lastName,
      email,
      uuid,
    } as PersistedUser);
  }
}

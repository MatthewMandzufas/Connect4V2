import { Uuid } from "@/global";
import { UserRepository } from "./user-repository";

export type PersistedUser = {
  firstName: string;
  lastName: string;
  email: string;
  uuid: `${string}-${string}-${string}-${string}-${string}`;
};

export default class InMemoryUserRepositoryFactory implements UserRepository {
  private users: Map<Uuid, PersistedUser>;

  constructor() {
    this.users = new Map();
  }

  async create(user) {
    const { firstName, lastName, email } = user;
    const uuid = crypto.randomUUID();
    await this.users.set(uuid, { firstName, lastName, email, uuid });
    return Promise.resolve({
      firstName,
      lastName,
      email,
      uuid,
    } as PersistedUser);
  }

  async findByEmail(email: string) {
    return Promise.resolve(
      Array.from(this.users.values()).filter((user) => user.email === email)
    );
  }
}

export type PersistedUser = {
  firstName: string;
  lastName: string;
  email: string;
  uuid: `${string}-${string}-${string}-${string}-${string}`;
  password: string;
};

export default class InMemoryUserRepositoryFactory implements UserRepository {
  private users: Map<Uuid, PersistedUser>;

  constructor() {
    this.users = new Map();
  }

  async create(user) {
    const { firstName, lastName, email, password } = user;
    const uuid = crypto.randomUUID();
    await this.users.set(uuid, { firstName, lastName, email, uuid, password });
    return Promise.resolve({
      firstName,
      lastName,
      email,
      uuid,
      password,
    } as PersistedUser);
  }

  async delete(email: string) {
    const user = await this.findByEmail(email);
    const isSuccess = this.users.delete(user[0].uuid);
    return { isSuccess };
  }

  async findByEmail(email: string) {
    return Promise.resolve(
      Array.from(this.users.values()).filter((user) => user.email === email),
    );
  }

  async findByUuid(userUuid: Uuid) {
    return this.users.get(userUuid);
  }
}

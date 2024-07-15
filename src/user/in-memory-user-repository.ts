type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
};

type PersistedUser = {
  firstName: string;
  lastName: string;
  email: string;
  uuid: `${string}-${string}-${string}-${string}-${string}`;
};

interface InMemoryUserRepository {
  create: (user: CreateUserParams) => PersistedUser;
}

export default class InMemoryUserRepositoryFactory
  implements InMemoryUserRepository
{
  private users;

  constructor() {
    this.users = new Map();
  }

  create(user) {
    const { firstName, lastName, email } = user;
    const uuid = crypto.randomUUID();
    this.users.set(uuid, { firstName, lastName, email });
    return {
      firstName,
      lastName,
      email,
      uuid,
    };
  }
}

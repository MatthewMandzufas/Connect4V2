export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

type PersistedUser = UserDetails & {
  uuid: Uuid;
};

export interface UserRepository {
  create: (userDetails: UserDetails) => Promise<PersistedUser>;
  findByEmail: (email: string) => Promise<Array<PersistedUser>>;
}

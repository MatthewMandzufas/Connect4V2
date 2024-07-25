export type UserSignupDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

type PersistedUser = UserSignupDetails & {
  uuid: Uuid;
};

export interface UserRepository {
  create: (userDetails: UserSignupDetails) => Promise<PersistedUser>;
  findByEmail: (email: string) => Promise<Array<PersistedUser>>;
}

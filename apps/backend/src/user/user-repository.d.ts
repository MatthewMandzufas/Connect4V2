type UserSignupDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

type UserCredentials = {
  email: string;
  password: string;
};

type PersistedUser = UserSignupDetails & {
  uuid: Uuid;
};

interface UserRepository {
  create: (userDetails: UserSignupDetails) => Promise<PersistedUser>;
  findByEmail: (email: string) => Promise<Array<PersistedUser>>;
  findByUuid: (userUuid: Uuid) => Promise<PersistedUser>;
  delete: (email: string) => Promise<{ isSuccess: boolean }>;
}

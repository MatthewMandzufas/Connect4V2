import { PersistedUser } from "./in-memory-user-repository";

export interface UserRepository {
  create: (userDetails: CreateUserParams) => Promise<PersistedUser>;
}

export type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
};

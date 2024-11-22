import { BackendApiInterface } from "@/backend-api";

export type AccountServiceParameters = {
  backendApi: BackendApiInterface;
};

export type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginDetails = {
  email: string;
  password: string;
};

export type AccountServicePayload = {
  isSuccess: boolean;
  message: string;
};

interface AccountServiceInterface {
  signUp: (signUpDetails: SignUpDetails) => Promise<AccountServicePayload>;
  login: (loginDetails: LoginDetails) => Promise<AccountServicePayload>;
  deleteUser: (userEmail: string) => Promise<AccountServicePayload>;
}

export default class AccountService implements AccountServiceInterface {
  #backendApi: BackendApiInterface;

  constructor({ backendApi }: AccountServiceParameters) {
    this.#backendApi = backendApi;
  }

  async signUp(signUpDetails: SignUpDetails) {
    const response = await this.#backendApi.signUp(signUpDetails);
    return {
      isSuccess: response.status === 201,
      message:
        response.status === 201 ? "Sign up successful!" : "Sign up failed.",
    };
  }

  async login(loginDetails: LoginDetails) {
    const response = await this.#backendApi.login(loginDetails);

    if (response.status === 200) {
      return {
        isSuccess: true,
        token: response.headers.get("authorization"),
        message: "Login successful!",
      };
    } else if (response.status === 403) {
      return {
        isSuccess: false,
        message: "Login failed.",
      };
    }

    // TODO: Try create a test to trigger this fail safe.
    return {
      isSuccess: false,
      message: "Something went wrong, please try again.",
    };
  }

  async deleteUser(email: string) {
    const response = await this.#backendApi.deleteUser(email);

    return {
      isSuccess: response.status === 200,
      message:
        response.status === 200
          ? "User successfully deleted!"
          : "User deletion failed.",
    };
  }
}

export type AccountServiceParameters = {
  backendUrl: string;
};

export type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

interface AccountServiceInterface {
  signUp: (signUpDetails: SignUpDetails) => Promise<{ isSuccess: boolean }>;
  deleteUser: (userEmail: string) => Promise<{ isSuccess: boolean }>;
}

export default class AccountService implements AccountServiceInterface {
  #backendUrl: string;

  constructor({ backendUrl }: AccountServiceParameters) {
    this.#backendUrl = backendUrl;
  }

  async signUp(signUpDetails: SignUpDetails) {
    const response = await fetch(`${this.#backendUrl}/signup`, {
      method: "POST",
      body: JSON.stringify(signUpDetails),
      headers: {
        "Content-type": "application/json",
      },
    });

    return {
      isSuccess: response.status === 201,
    };
  }

  async deleteUser(email: string) {
    const response = await fetch(`${this.#backendUrl}/delete`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-type": "application/json",
      },
    });

    return {
      isSuccess: response.status === 200,
    };
  }
}

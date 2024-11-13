type LoginDetails = {
  email: string;
  password: string;
};

type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type BackendApiParams = {
  url: string;
};

export interface BackendApiInterface {
  login: (loginDetails: LoginDetails) => Promise<Response>;
  signUp: (signUpDetails: SignUpDetails) => Promise<Response>;
  deleteUser: (email: string) => Promise<Response>;
}

class BackendApi implements BackendApiInterface {
  url: string;

  constructor({ url }: BackendApiParams) {
    this.url = url;
  }

  async login({ email, password }: LoginDetails) {
    return await fetch(`${this.url}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        userName: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async signUp(signUpDetails: SignUpDetails) {
    return await fetch(`${this.url}/user/signup`, {
      method: "POST",
      body: JSON.stringify(signUpDetails),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteUser(email: string) {
    return await fetch(`${this.url}/user/delete`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default BackendApi;

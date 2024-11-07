type LoginDetails = {
  email: string;
  password: string;
};

type BackendApiParams = {
  url: string;
};

export interface BackendApiInterface {
  login: (loginDetails: LoginDetails) => Promise<Response>;
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
}

export default BackendApi;

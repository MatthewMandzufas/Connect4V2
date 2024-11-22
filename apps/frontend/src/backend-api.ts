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

type InviteDetails = {
  invitee: string;
  inviter: string;
};

type BackendApiParams = {
  url: string;
};

export interface BackendApiInterface {
  login: (loginDetails: LoginDetails) => Promise<Response>;
  signUp: (signUpDetails: SignUpDetails) => Promise<Response>;
  deleteUser: (email: string) => Promise<Response>;
  sendInvite: (InviteDetails: InviteDetails) => Promise<Response>;
}

class BackendApi implements BackendApiInterface {
  url: string;
  #authorisationToken: string;

  constructor({ url }: BackendApiParams) {
    this.url = url;
    this.#authorisationToken = "";
  }

  async login({ email, password }: LoginDetails) {
    const response = await fetch(`${this.url}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        userName: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.#authorisationToken = response.headers.get("authorization") ?? "";
    return response;
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

  async sendInvite({ invitee, inviter }: InviteDetails) {
    const response = await fetch(`${this.url}/invite`, {
      method: "POST",
      body: JSON.stringify({
        invitee,
        inviter,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: this.#authorisationToken,
      },
    });
    console.log(this.#authorisationToken);
    return response;
  }
}

export default BackendApi;

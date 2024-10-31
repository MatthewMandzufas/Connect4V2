export type SignUpServiceParameters = {
  backendUrl: string;
};

type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default class SignUpService {
  #backendUrl: string;

  constructor({ backendUrl }: SignUpServiceParameters) {
    this.#backendUrl = backendUrl;
  }

  async signUp(signUpDetails: SignUpDetails) {
    const response = await fetch(`${this.#backendUrl}`, {
      method: "POST",
      body: JSON.stringify(signUpDetails),
      headers: {
        "Content-type": "application/json",
      },
    });

    const jsonResponse = await response.json();

    console.log(response);
    console.log(jsonResponse);

    return {
      isSuccess: response.status === 201,
    };
  }
}

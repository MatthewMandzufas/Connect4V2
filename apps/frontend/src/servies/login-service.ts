type LoginDetails = {
  email: string;
  password: string;
};

type LoginServiceParams = {
  url: string;
};

class LoginService {
  url: string;

  constructor({ url }: LoginServiceParams) {
    this.url = url;
  }

  async login(loginDetails: LoginDetails) {
    const response = await fetch(`${this.url}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        userName: loginDetails.email,
        password: loginDetails.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return {
        isSuccess: true,
        token: response.headers.get("authorization"),
        message: "Login Successful!",
      };
    }

    if (response.status === 403) {
      return {
        isSuccess: false,
        message: "Login Failed.",
      };
    }

    return { isSuccess: false, message: "Error occurred while logging in." };
  }
}

export default LoginService;

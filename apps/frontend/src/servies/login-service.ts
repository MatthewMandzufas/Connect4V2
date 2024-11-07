import { BackendApiInterface } from "@/backend-api";

type LoginDetails = {
  email: string;
  password: string;
};

type LoginServiceParams = {
  backendApi: BackendApiInterface;
};

class LoginService {
  backendApi: BackendApiInterface;

  constructor({ backendApi }: LoginServiceParams) {
    this.backendApi = backendApi;
  }

  async login(loginDetails: LoginDetails) {
    const response = await this.backendApi.login(loginDetails);

    if (response.status === 200) {
      return {
        isSuccess: true,
        token: response.headers.get("authorization"),
        message: "Login Successful!",
      };
    } else if (response.status === 403) {
      return {
        isSuccess: false,
        message: "Login Failed.",
      };
    }

    // TODO: Try create a test to trigger this fail safe.
    return {
      isSuccess: false,
      message: "Something went wrong, please try again.",
    };
  }
}

export default LoginService;

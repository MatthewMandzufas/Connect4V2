"use client";

import BackendApi from "@/backend-api";
import LoginForm, { LoginDetails } from "@/components/LoginForm";
import LoginService from "@/servies/login-service";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const backendApi = new BackendApi({ url: `http://localhost:3000` });
  const router = useRouter();
  const signUpRedirectHandler = async () => router.push("/signup");
  const loginService = new LoginService({ backendApi });
  const loginHandler = async ({ email, password }: LoginDetails) =>
    await loginService.login({ email, password });
  return (
    <div>
      <LoginForm
        loginHandler={loginHandler}
        redirectToSignUpHandler={signUpRedirectHandler}
      />
    </div>
  );
};

export default LoginPage;

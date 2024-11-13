"use client";

import BackendApi from "@/backend-api";
import LoginForm from "@/components/LoginForm";
import AccountService, { LoginDetails } from "@/servies/account-service";
import { useRouter } from "next/navigation";

const loginHandler = async (loginDetails: LoginDetails) => {
  const backendApi = new BackendApi({ url: "http://localhost:3001" });
  const accountService = new AccountService({ backendApi });

  return await accountService.login(loginDetails);
};

const LoginPage = () => {
  const router = useRouter();
  const signUpRedirectHandler = async () => router.push("/signup");

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

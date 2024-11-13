"use client";

import BackendApi from "@/backend-api";
import SignUpForm from "@/components/SignUpForm";
import AccountService, { SignUpDetails } from "@/servies/account-service";
import { useRouter } from "next/navigation";

const signUpHandler = async (signUpDetails: SignUpDetails) => {
  const backendApi = new BackendApi({ url: "http://localhost:3001" });
  const accountService = new AccountService({
    backendApi,
  });

  return await accountService.signUp(signUpDetails);
};

const SignUpPage = () => {
  const router = useRouter();
  const loginRedirectHandler = async () => router.push("/login");

  return (
    <div>
      <SignUpForm
        redirectToLoginHandler={loginRedirectHandler}
        signUpHandler={signUpHandler}
      />
    </div>
  );
};

export default SignUpPage;

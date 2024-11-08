"use client";

import SignUpForm from "@/components/SignUpForm";
import AccountService, { SignUpDetails } from "@/servies/account-service";
import { useRouter } from "next/navigation";

const signUpHandler = async ({
  firstName,
  lastName,
  email,
  password,
}: SignUpDetails) => {
  const accountService = new AccountService({
    backendUrl: "http://localhost:3001/user",
  });
  const response = await accountService.signUp({
    firstName,
    lastName,
    email,
    password,
  });
  return {
    ...response,
    message: response.isSuccess ? "Success" : "An Error Occurred",
  };
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

"use client";

import BackendApi from "@/backend-api";
import SignUpForm from "@/components/SignUpForm";
import AccountService, { SignUpDetails } from "@/servies/account-service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const createSignUpHandler =
  (router: AppRouterInstance) =>
  async ({ firstName, lastName, email, password }: SignUpDetails) => {
    const backendApi = new BackendApi({ url: "http://localhost:3001/user" });
    const accountService = new AccountService({
      backendApi,
    });
    const response = await accountService.signUp({
      firstName,
      lastName,
      email,
      password,
    });

    const message = response.isSuccess ? "Success" : "An Error Occurred";
    if (response.isSuccess) {
      router.push("/login");
    }

    return {
      ...response,
      message,
    };
  };

const SignUpPage = () => {
  const router = useRouter();
  const loginRedirectHandler = async () => router.push("/login");

  return (
    <div>
      <SignUpForm
        redirectToLoginHandler={loginRedirectHandler}
        signUpHandler={createSignUpHandler(router)}
      />
    </div>
  );
};

export default SignUpPage;

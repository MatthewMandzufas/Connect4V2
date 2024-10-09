"use client";

import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";

// const signUpHandler = async ({firstName, lastName, email, password}) => {

// }

const SignUpPage = () => {
  const router = useRouter();
  const loginRedirectHandler = async () => router.push("/login");

  return (
    <div>
      <SignUpForm redirectToLoginHandler={loginRedirectHandler} />
    </div>
  );
};

export default SignUpPage;

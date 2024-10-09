"use client";

import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const signUpRedirectHandler = async () => router.push("/signup");

  return (
    <div>
      <LoginForm redirectToSignUpHandler={signUpRedirectHandler} />
    </div>
  );
};

export default LoginPage;

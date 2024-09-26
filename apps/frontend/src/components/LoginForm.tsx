import { useState } from "react";

type LoginDetails = {
  email: string;
  password: string;
};

type LoginHandler = (loginDetails: LoginDetails) => unknown;

type LoginFormProps = {
  loginHandler: LoginHandler;
};

const LoginForm = ({
  loginHandler: handleLogin = (loginDetails: LoginDetails) => {},
}: LoginFormProps) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <form className="flex flex-col max-w-44 gap-3">
      <label htmlFor="email">Email</label>
      <input
        className="text-black"
        type="email"
        name="email"
        id="email"
        required
      />
      <label htmlFor="password">Password</label>
      <input
        className="text-black"
        type="password"
        name="password"
        id="password"
        required
      />
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          if (email && password) {
            handleLogin({ email, password });
          }
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;

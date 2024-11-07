/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

export type LoginDetails = {
  email: string;
  password: string;
};

type LoginResponse = {
  isSuccess: boolean;
  message: string;
};

type LoginHandler = (loginDetails: LoginDetails) => Promise<LoginResponse>;

type LoginFormProps = {
  loginHandler: LoginHandler;
  redirectToSignUpHandler: () => Promise<void>;
};

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateFields = ({
  email,
  password,
}: LoginDetails): ValidationResult => {
  if (!email.match(emailRegex)) {
    return {
      isValid: false,
      error: "Invalid email address.",
    };
  }

  if (password.length <= 5) {
    return {
      isValid: false,
      error: "Password must be at least 6 letters.",
    };
  }

  return {
    isValid: true,
  };
};

enum LoginState {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

type MessageProps = {
  isError: boolean;
  message: string;
};

const Message = ({ isError, message }: MessageProps) => (
  <span
    className={`flex items-center font-medium tracking-wide ${isError ? "text-red-500" : "text-green-500"} text-xs h-4`}
  >
    {message}
  </span>
);

const LoginForm = ({
  loginHandler = () => Promise.reject(),
  redirectToSignUpHandler,
}: LoginFormProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState({ isError: false, message: "" });
  const [loginState, setLoginState] = useState(LoginState.IDLE);

  return (
    <div className="border border-grey-300- rounded-md p-6 max-w-md mx-auto">
      <form className="flex flex-col bg-stone-700 max-w-44 gap-3 p-4 mx-auto max-w-md">
        <label htmlFor="email">Email</label>
        <input
          readOnly={
            loginState === LoginState.PENDING ||
            loginState === LoginState.SUCCESS
          }
          className="text-black"
          type="email"
          name="email"
          id="email"
          placeholder="Enter Your Email"
          required
          onChange={(event) => {
            setEmail(event.target.value);
            setLoginState(LoginState.IDLE);
            setMessage({ isError: false, message: "" });
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          className="text-black"
          type="password"
          name="password"
          placeholder="Enter Your Password"
          id="password"
          onChange={(event) => {
            setPassword(event.target.value);
            setLoginState(LoginState.IDLE);
            setMessage({ isError: false, message: "" });
          }}
          required
          readOnly={
            loginState === LoginState.PENDING ||
            loginState === LoginState.SUCCESS
          }
        />
        {loginState === LoginState.PENDING ? (
          <button
            className="text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
            disabled
          >
            <PulseLoader loading={true} color={"#ffffff"} size={10} />
          </button>
        ) : (
          <button
            disabled={loginState === LoginState.SUCCESS}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={async (event) => {
              event.preventDefault();

              if (email && password) {
                const { isValid, error } = validateFields({ email, password });

                if (!isValid) {
                  setLoginState(LoginState.FAILED);
                  setMessage({ isError: true, message: error! });
                  return;
                }

                setMessage({ isError: false, message: error! });
                setLoginState(LoginState.PENDING);
                try {
                  const { message, isSuccess } = await loginHandler({
                    email,
                    password,
                  });
                  setLoginState(LoginState.SUCCESS);
                  setMessage({ isError: !isSuccess, message });
                } catch (error) {
                  const { message } = error as LoginResponse;
                  setLoginState(LoginState.FAILED);
                  setMessage({ isError: true, message });
                }
              } else {
                setMessage({
                  isError: true,
                  message: "All fields are required.",
                });
              }
            }}
          >
            Login
          </button>
        )}
        <a
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            redirectToSignUpHandler();
          }}
          className="flex justify-center cursor-pointer"
        >
          Sign Up
        </a>
        <Message {...message} />
      </form>
    </div>
  );
};
export default LoginForm;

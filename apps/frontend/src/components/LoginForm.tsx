import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

type LoginDetails = {
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
  if (!email && !password) {
    return {
      isValid: false,
      error: "All fields are required.",
    };
  }

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

const LoginForm = ({
  loginHandler = () => Promise.reject(),
}: LoginFormProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isLoginPending, setIsLoginPending] = useState<boolean>(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>();
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string>();

  return (
    <form className="flex flex-col max-w-44 gap-3">
      <label htmlFor="email">Email</label>
      <input
        readOnly={isLoginPending || loginSuccessMessage !== undefined}
        className="text-black"
        type="email"
        name="email"
        id="email"
        placeholder="Enter Your Email"
        required
        onChange={(event) => {
          setEmail(event.target.value);
          setLoginErrorMessage(undefined);
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
          setLoginErrorMessage(undefined);
        }}
        required
        readOnly={isLoginPending || loginSuccessMessage !== undefined}
      />
      {isLoginPending ? (
        <button
          className="text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
          disabled
        >
          <PulseLoader loading={true} color={"#ffffff"} size={10} />
        </button>
      ) : (
        <button
          disabled={loginSuccessMessage !== undefined}
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={async (event) => {
            event.preventDefault();

            if (email && password) {
              const { isValid, error } = validateFields({ email, password });

              if (!isValid) {
                setLoginErrorMessage(error);
                return;
              }

              setLoginErrorMessage(undefined);
              setIsLoginPending(true);
              try {
                const { message } = await loginHandler({
                  email,
                  password,
                });
                setLoginSuccessMessage(message);
              } catch (error) {
                const { message } = error as LoginResponse;
                setLoginErrorMessage(message);
              }
              setIsLoginPending(false);
            }
          }}
        >
          Submit
        </button>
      )}
      {loginErrorMessage ? (
        <p className="text-red-600 underline">{loginErrorMessage}</p>
      ) : (
        <></>
      )}
      {loginSuccessMessage ? (
        <p className="text-green-600 underline">{loginSuccessMessage}</p>
      ) : (
        <></>
      )}
    </form>
  );
};
export default LoginForm;

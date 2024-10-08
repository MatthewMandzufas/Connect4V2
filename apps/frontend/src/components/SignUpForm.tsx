/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type SignUpResponse = {
  isSuccess: boolean;
  message: string;
};

type SignUpHandler = (signUpDetails: SignUpDetails) => Promise<SignUpResponse>;

type SignUpHandlerProps = {
  redirectToLoginHandler: (values: any) => void;
  signUpHandler: SignUpHandler;
};

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateFields = ({
  email,
  password,
}: SignUpDetails): ValidationResult => {
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

enum LoginState {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

const SignUpForm = ({
  redirectToLoginHandler,
  signUpHandler,
}: SignUpHandlerProps) => {
  const [email, setEmail] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState({ isError: false, message: "" });
  const [loginState, setLoginState] = useState(LoginState.IDLE);

  return (
    <div className="border border-grey-300- rounded-md p-6 max-w-md mx-auto">
      <form className="flex flex-col bg-stone-700 max-w-44 gap-3 p-4 mx-auto max-w-md">
        <label htmlFor="firstName">First Name</label>
        <input
          readOnly={
            loginState === LoginState.PENDING ||
            loginState === LoginState.SUCCESS
          }
          className="text-black"
          // type=""
          name="firstName"
          id="firstName"
          placeholder="Enter Your First Name"
          required
          onChange={(event) => {
            console.log(loginState);
            setFirstName(event.target.value);
            setLoginState(LoginState.IDLE);
            setMessage({ isError: false, message: "" });
          }}
        />
        <label htmlFor="Last Name">Last Name</label>
        <input
          readOnly={
            loginState === LoginState.PENDING ||
            loginState === LoginState.SUCCESS
          }
          className="text-black"
          // type=""
          name="lastName"
          id="lastName"
          placeholder="Enter Your Last Name"
          required
          onChange={(event) => {
            setLastName(event.target.value);
            setLoginState(LoginState.IDLE);
            setMessage({ isError: false, message: "" });
          }}
        />
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

              if (email && password && firstName && lastName) {
                const { isValid, error } = validateFields({
                  firstName,
                  lastName,
                  email,
                  password,
                });

                if (!isValid) {
                  setLoginState(LoginState.FAILED);
                  setMessage({ isError: true, message: error! });
                  return;
                }

                setMessage({ isError: false, message: "" });
                setLoginState(LoginState.PENDING);
                try {
                  const { message, isSuccess } = await signUpHandler({
                    firstName,
                    lastName,
                    email,
                    password,
                  });
                  setMessage({ isError: !isSuccess, message });
                  setLoginState(
                    isSuccess === true ? LoginState.SUCCESS : LoginState.FAILED
                  );
                } catch (error) {
                  const { message } = error as SignUpResponse;
                  setMessage({ isError: true, message });
                  setLoginState(LoginState.FAILED);
                }
              } else {
                setMessage({
                  isError: true,
                  message: "All fields are required.",
                });
              }
            }}
          >
            Sign Up
          </button>
        )}
        <a {...redirectToLoginHandler} className="flex justify-center">
          Login In
        </a>

        <Message {...message} />
      </form>
    </div>
  );
};

export default SignUpForm;

// hooks/useAuth.js :)export const useAuth = () => {  const dispatch = useDispatch();  const handleLogin = async (credentials) => {    const user = await login(credentials);    dispatch(loginSuccess(user));  };  return { handleLogin };};

import LoginForm from "@/components/LoginForm";
import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "@storybook/test";

type Story = StoryObj<typeof LoginForm>;

const meta: Meta<typeof LoginForm> = {
  // title: "Testing/1/2",
  component: LoginForm,
};

export default meta;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filOutLoginFormCorrectly = async (canvas: any) => {
  const emailInput = canvas.getByPlaceholderText("Enter Your Email");
  const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
  await userEvent.type(emailInput, "hello@email.com");
  await userEvent.type(passwordInput, "somethingSecure");
};

// Stories before login button is clicked
export const TheOneWithDefaults: Story = {};
export const TheOneWithALoginHandler: Story = {
  args: {
    loginHandler: fn((loginValues) => {
      return loginValues;
    }),
  },
};

export const TheOneWithAnInvalidEmail: Story = {
  args: {
    loginHandler: fn((loginValues) => {
      return loginValues;
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText("Enter Your Email");
    const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
    await userEvent.type(emailInput, "faultyEmail");
    await userEvent.type(passwordInput, "somethingSecure");
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithAnInvalidPassword: Story = {
  args: {
    loginHandler: fn((loginValues) => {
      return loginValues;
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText("Enter Your Email");
    const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
    await userEvent.type(emailInput, "hello@email.com");
    await userEvent.type(passwordInput, "short");
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

// Stories with a pending login
export const TheOneWithALoginInProgress: Story = {
  args: {
    loginHandler: fn(() => Promise.race([])),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await filOutLoginFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

// Stories with a failed login

export const TheOneWithAFailedLogin: Story = {
  args: {
    loginHandler: fn(() =>
      Promise.reject({ isSuccess: false, message: "Login Failed" })
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await filOutLoginFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithASuccessfulLogin: Story = {
  args: {
    loginHandler: fn(() =>
      Promise.resolve({ isSuccess: true, message: "Login Successful!" })
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await filOutLoginFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

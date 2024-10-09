/* eslint-disable @typescript-eslint/no-explicit-any */
import SignUpForm from "@/components/SignUpForm";
import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "@storybook/test";

type Story = StoryObj<typeof SignUpForm>;

const meta: Meta<typeof SignUpForm> = {
  component: SignUpForm,
};

export default meta;
const fillOutSignUpFormCorrectly = async (canvas: any) => {
  const emailInput = canvas.getByPlaceholderText("Enter Your Email");
  const firstNameInput = canvas.getByPlaceholderText("Enter Your First Name");
  const lastNameInput = canvas.getByPlaceholderText("Enter Your Last Name");
  const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
  await userEvent.type(firstNameInput, "Thierry");
  await userEvent.type(lastNameInput, "Henry");
  await userEvent.type(emailInput, "workingEmail@email.com");
  await userEvent.type(passwordInput, "somethingSecure");
};

export const TheOneWithDefaults: Story = {};

export const TheOneWithFieldsMissing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithASignUpHandler: Story = {
  args: {
    signUpHandler: fn((signUpValues) => {
      return signUpValues;
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillOutSignUpFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithALoginLink: Story = {
  args: {
    redirectToLoginHandler: fn(() => Promise.resolve()),
  },
};

export const TheOneWithAnInvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText("Enter Your Email");
    const firstNameInput = canvas.getByPlaceholderText("Enter Your First Name");
    const lastNameInput = canvas.getByPlaceholderText("Enter Your Last Name");
    const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
    await userEvent.type(firstNameInput, "Thierry");
    await userEvent.type(lastNameInput, "Henry");
    await userEvent.type(emailInput, "faultyEmail");
    await userEvent.type(passwordInput, "somethingSecure");
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithAnInvalidPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByPlaceholderText("Enter Your Email");
    const firstNameInput = canvas.getByPlaceholderText("Enter Your First Name");
    const lastNameInput = canvas.getByPlaceholderText("Enter Your Last Name");
    const passwordInput = canvas.getByPlaceholderText("Enter Your Password");
    await userEvent.type(firstNameInput, "Thierry");
    await userEvent.type(lastNameInput, "Henry");
    await userEvent.type(emailInput, "workingEmail@email.com");
    await userEvent.type(passwordInput, "short");
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithASignUpInProgress: Story = {
  args: {
    signUpHandler: fn(() => Promise.race([])),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillOutSignUpFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },
};

export const TheOneWithAFailedSignUp: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillOutSignUpFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },

  args: {
    signUpHandler: fn(() =>
      Promise.reject({ isSuccess: false, message: "Login Failed" })
    ),
  },
};

export const TheOneWithASuccessfulSignUp: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillOutSignUpFormCorrectly(canvas);
    const loginButton = canvas.getByRole("button");
    await userEvent.click(loginButton);
  },

  args: {
    signUpHandler: fn(() =>
      Promise.resolve({ isSuccess: true, message: "Login Successful!" })
    ),
  },
};

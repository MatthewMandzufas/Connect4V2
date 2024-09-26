import LoginForm from "@/components/LoginForm";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { MouseEvent } from "react";

type Story = StoryObj<typeof LoginForm>;

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
export const TheOneWithDefaults: Story = {};
export const TheOneWithALoginHandler: Story = {
  args: {
    loginHandler: fn((event: MouseEvent) => {
      event.preventDefault();
    }),
  },
};

export const The: Story = {
  args: {
    loginHandler: fn((event: MouseEvent) => {
      event.preventDefault();
    }),
  },
};

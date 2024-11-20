import InviteForm from "@/components/InviteForm";
import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "@storybook/test";

type Story = StoryObj<typeof InviteForm>;

const meta: Meta<typeof InviteForm> = {
  component: InviteForm,
};

export default meta;

export const TheOneWithDefaults: Story = {};
export const TheOneWithAInviteHandler: Story = {
  args: {
    inviteHandler: fn((inviteValues) => {
      return inviteValues;
    }),
  },
};

export const TheOneWithAInvalidEmail: Story = {
  args: {
    inviteHandler: fn(() =>
      Promise.resolve({ isSuccess: false, message: "User does not exist" })
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inviteeInput = canvas.getByPlaceholderText("Enter email here...");
    await userEvent.type(inviteeInput, "john@mail.com");
    const sendInviteButton = canvas.getByRole("button");
    await userEvent.click(sendInviteButton);
  },
};

export const TheOneWithAValidEmail: Story = {
  args: {
    inviteHandler: fn(() =>
      Promise.resolve({ isSuccess: true, message: "Invite sent" })
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inviteeInput = canvas.getByPlaceholderText("Enter email here...");
    await userEvent.type(inviteeInput, "pork@mail.com");
    const sendInviteButton = canvas.getByRole("button");
    await userEvent.click(sendInviteButton);
  },
};

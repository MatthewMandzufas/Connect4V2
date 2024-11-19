import InviteForm from "@/components/InviteForm";
import { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof InviteForm>;

const meta: Meta<typeof InviteForm> = {
  component: InviteForm,
};

export default meta;

export const TheOneWithDefaults: Story = {};

import { FixtureWrapper } from "FixtureWrapper";
import { ToggleMode, ToggleModeProps } from "./ToggleMode";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<ToggleModeProps> = {
  title: "common/ToggleMode",
  component: ToggleMode,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<ToggleModeProps>;

export const BaseCase: Story = {
  args: {
    mode: "Notes",
  },
  render: (args) => {
    return (
      <FixtureWrapper>
        <ToggleMode {...args} />
      </FixtureWrapper>
    );
  },
};

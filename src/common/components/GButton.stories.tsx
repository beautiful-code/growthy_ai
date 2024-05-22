import { FixtureWrapper } from "FixtureWrapper";
import { GButton, GButtonProps } from "./GButton";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<GButtonProps> = {
  title: "common/GButton",
  component: GButton,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<GButtonProps>;

export const Primary: Story = {
  args: {},
  render: (args) => {
    return (
      <FixtureWrapper>
        <GButton
          {...args}
          m={2}
          type="primary"
          size="md"
          onClick={() => console.log("Primary button clicked")}
        >
          Primary Button
        </GButton>
      </FixtureWrapper>
    );
  },
};

export const Secondary: Story = {
  args: {},
  render: (args) => {
    return (
      <FixtureWrapper>
        <GButton
          {...args}
          type="secondary"
          size="md"
          onClick={() => console.log("Secondary button clicked")}
        >
          Secondary Button
        </GButton>
      </FixtureWrapper>
    );
  },
};

export const SecondarySmall: Story = {
  args: {},
  render: (args) => {
    return (
      <FixtureWrapper>
        <GButton
          {...args}
          type="secondary"
          size="sm"
          onClick={() => console.log("Secondary button clicked")}
        >
          Secondary Button
        </GButton>
      </FixtureWrapper>
    );
  },
};

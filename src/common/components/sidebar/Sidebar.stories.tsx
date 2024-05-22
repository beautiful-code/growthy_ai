import { Meta, StoryObj } from "@storybook/react";
import { FixtureWrapper } from "FixtureWrapper";
import { SideBarProps, Sidebar } from "common/components/sidebar/Sidebar";

const meta: Meta<SideBarProps> = {
  title: "common/SideBar",
  component: Sidebar,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<SideBarProps>;

export const BaseCase: Story = {
  args: {
    selectedGuildId: "",
  },
  render: (args) => {
    return (
      <FixtureWrapper>
        <Sidebar {...args} />
      </FixtureWrapper>
    );
  },
};

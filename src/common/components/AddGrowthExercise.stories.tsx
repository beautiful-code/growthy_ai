import { Meta, StoryObj } from "@storybook/react";
import { FixtureWrapper } from "FixtureWrapper";
import {
  AddGrowthExercise,
  AddGrowthExerciseProps,
} from "common/components/AddGrowthExercise";

const meta: Meta<AddGrowthExerciseProps> = {
  title: "common/Add Growth Exercise",
  component: AddGrowthExercise,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<AddGrowthExerciseProps>;

export const BaseCase: Story = {
  args: {
    createParams: {
      type: "user-view",
      guildId: "",
    },
  },
  render: (args) => {
    return (
      <FixtureWrapper>
        <AddGrowthExercise {...args} />
      </FixtureWrapper>
    );
  },
};

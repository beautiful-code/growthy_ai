import { FixtureWrapper } from "FixtureWrapper";
import { getExercisesPaginatedMock } from "../../mocks/getExercisesPaginatedMock";
import { Exercises, ExercisesProps } from "common/components/Exercises";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<ExercisesProps> = {
  title: "common/Exercises",
  component: Exercises,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<ExercisesProps>;

export const BaseCase: Story = {
  args: {},
  render: (args) => {
    return (
      <FixtureWrapper>
        <Exercises
          {...args}
          title="Publications from the last"
          defaultDuration={7}
          queryFunction={getExercisesPaginatedMock}
          type={"published"}
        />
      </FixtureWrapper>
    );
  },
};

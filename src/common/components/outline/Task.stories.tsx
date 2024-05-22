import { useState } from "react";

import { Box } from "@chakra-ui/react";
import { Task, TaskProps } from "common/components/outline/Task";

import { UITask } from "domain/common/UITask";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<TaskProps> = {
  title: "common/outline/Task",
  component: Task,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<TaskProps>;

export const BaseCase: Story = {
  args: {},
  render: (args) => {
    const [taskXml, setTaskXml] = useState(
      "<Task name='task1' checked='true' />"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            {...args}
            uiTask={
              new UITask({
                uuid: "1",
                xml: taskXml,
              })
            }
            onUpdateTaskCallback={(uiTask) => {
              console.log("onUpdateTaskCallback called");
              setTaskXml(uiTask._xml);
            }}
            handleSelectTask={() => {
              console.log("handleSelectTask called");
            }}
          />
        </FixtureWrapper>
      </Box>
    );
  },
};

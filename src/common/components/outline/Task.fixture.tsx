import { useState } from "react";

import { Box } from "@chakra-ui/react";
import { Task } from "common/components/outline/Task";

import { UITask } from "domain/common/UITask";
import { FixtureWrapper } from "FixtureWrapper";

export default {
  "base case": () => {
    const [taskXml, setTaskXml] = useState(
      "<Task name='task1' checked='true' />"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
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
          />
        </FixtureWrapper>
      </Box>
    );
  },
};

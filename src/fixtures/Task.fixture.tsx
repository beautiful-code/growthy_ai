import { useState } from "react";

import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box } from "@chakra-ui/react";
import { Task } from "common/components/outline/Task";

import { UITask } from "domain/blog-article/UITask";

export default {
  "base case": () => {
    // const uiSection = new UISection( "<Section name='section1'><Task name='task1' checked='true' /></Section>");

    const [taskXml, setTaskXml] = useState(
      "<Task name='task1' checked='true' />"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            uiTask={new UITask(taskXml)}
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

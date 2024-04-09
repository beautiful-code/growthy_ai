import { useState } from "react";

import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box } from "@chakra-ui/react";
import { Task } from "common/components/outline/Task";

import { UISection } from "domain/blog-article/UISection";
import { UITask } from "domain/blog-article/UITask";

export default {
  "base case": () => {
    // const uiSection = new UISection( "<Section name='section1'><Task name='task1' checked='true' /></Section>");

    const [taskXml, setTaskXml] = useState("<Task name='task1' checked='true' />");

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            // taskIndex={0}
            //uiTask={new UITask(section.getUITasks()[0]._xml)}
            uiTask={new UITask(taskXml)}
            onUpdateTaskCallback={(uiTask) => {
              console.log("callback called");
              setTaskXml(uiTask._xml);
            }}
            /*
            updateTaskXML={(taskIndex, taskXML) => {
              section.updateTask(taskIndex, taskXML);
              console.log(section._xml);
            }}
            */
          />
        </FixtureWrapper>
      </Box>
    );
  },
  // editing: () => {
  //   return (
  //     <Box m={8}>
  //       <FixtureWrapper>
  //         <Task
  //           defaultEditing={true}
  //           sectionIndex={0}
  //           taskIndex={1}
  //           task={{
  //             text: "Introduce Microservices Architecture",
  //             is_action_item: true,
  //           }}
  //           checkingDisabled={false}
  //           setSections={() => {}}
  //         />
  //       </FixtureWrapper>
  //     </Box>
  //   );
  // },
  // disabled: () => {
  //   return (
  //     <Box m={8}>
  //       <FixtureWrapper>
  //         <Task
  //           defaultEditing={false}
  //           sectionIndex={0}
  //           taskIndex={1}
  //           task={{
  //             text: "Introduce Microservices Architecture",
  //             is_action_item: true,
  //           }}
  //           checkingDisabled={true}
  //           setSections={() => {}}
  //         />
  //       </FixtureWrapper>
  //     </Box>
  //   );
  // },
};

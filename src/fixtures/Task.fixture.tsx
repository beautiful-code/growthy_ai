import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box } from "@chakra-ui/react";
import { Task } from "common/components/outline/Task";

export default {
  "base case": () => {
    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            defaultEditing={false}
            sectionIndex={0}
            taskIndex={1}
            task={{
              text: "Introduce Microservices Architecture",
              is_action_item: true,
            }}
            checkingDisabled={false}
            setSections={() => {}}
          />
        </FixtureWrapper>
      </Box>
    );
  },
  editing: () => {
    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            defaultEditing={true}
            sectionIndex={0}
            taskIndex={1}
            task={{
              text: "Introduce Microservices Architecture",
              is_action_item: true,
            }}
            checkingDisabled={false}
            setSections={() => {}}
          />
        </FixtureWrapper>
      </Box>
    );
  },
  disabled: () => {
    return (
      <Box m={8}>
        <FixtureWrapper>
          <Task
            defaultEditing={false}
            sectionIndex={0}
            taskIndex={1}
            task={{
              text: "Introduce Microservices Architecture",
              is_action_item: true,
            }}
            checkingDisabled={true}
            setSections={() => {}}
          />
        </FixtureWrapper>
      </Box>
    );
  },
};

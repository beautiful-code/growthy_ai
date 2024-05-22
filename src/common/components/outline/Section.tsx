import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Flex,
  CircularProgress,
} from "@chakra-ui/react";

import { Task } from "./Task";
import { UISection } from "domain/common/UISection";
import { UITask } from "domain/common/UITask";
import { domainUpdateAndCallback } from "common/utils";

import "./Section.css";

export type SectionProps = {
  uiSection: UISection;
  checkingEnabled?: boolean;
  taskSelectionEnabled?: boolean;
  onUpdateSectionCallback: (uiSection: UISection) => void;
  handleSelectTask: (taskId: string) => void;
};

export const Section: React.FC<SectionProps> = ({
  uiSection,
  checkingEnabled = false,
  taskSelectionEnabled = false,
  onUpdateSectionCallback,
  handleSelectTask,
}) => {
  // Factory function to create a callback function that updates a task at a given index
  const onUpdateTaskCallback = (taskIndex: number) => (uiTask: UITask) => {
    domainUpdateAndCallback(
      uiSection,
      "updateTask",
      [taskIndex, uiTask],
      onUpdateSectionCallback
    );
  };

  const handleExpandSection = () => {
    if (uiSection.getIsExpanded()) {
      uiSection.collapseSection();
      onUpdateSectionCallback(uiSection);
    } else {
      uiSection.expandSection();
      onUpdateSectionCallback(uiSection);
    }
  };

  return (
    <AccordionItem key={1} border="none">
      <h2>
        <AccordionButton
          className="section-btn"
          _hover={{ bg: "none" }}
          _focus={{ boxShadow: "none" }}
          _expanded={{ bg: "none", fontWeight: "bold" }}
          p={0}
        >
          <Flex
            width={"100%"}
            grow={2}
            align="center"
            onClick={handleExpandSection}
          >
            <Flex grow={2} align="center">
              <CircularProgress
                mr="4px"
                size="24px"
                value={uiSection.getCompletionProgress()}
              />

              <Text
                as="span"
                fontSize="lg"
                fontWeight="semibold"
                textAlign={"left"}
              >
                {uiSection.getSectionName()}
              </Text>
            </Flex>
          </Flex>
        </AccordionButton>
      </h2>

      <AccordionPanel pb={4} pl={10}>
        {uiSection?.getUITasks().map((task, taskIndex) => (
          <Task
            uiTask={task}
            checkingEnabled={checkingEnabled}
            taskSelectionEnabled={taskSelectionEnabled}
            onUpdateTaskCallback={onUpdateTaskCallback(taskIndex)}
            handleSelectTask={handleSelectTask}
            key={task.getUUID()}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};

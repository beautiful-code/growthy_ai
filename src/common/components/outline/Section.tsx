import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";

import { Task } from "./Task";
import { UISection } from "domain/blog-article/UISection";

type Props = {
  sectionIndex: number;
  uiSection: UISection;
  updateSectionXML: (sectionIndex: number, sectionXML: string) => void;
};

export const Section: React.FC<Props> = ({
  sectionIndex,
  uiSection,
  updateSectionXML,
}) => {
  const updateTaskXML = (taskIndex: number, taskXML: string) => {
    uiSection.updateTask(taskIndex, taskXML);
    updateSectionXML(sectionIndex, uiSection._xml);
  };

  return (
    <Accordion allowMultiple allowToggle>
      <AccordionItem key={1} border="none">
        <h2>
          <AccordionButton
            className="section-btn"
            _hover={{ bg: "none" }}
            _focus={{ boxShadow: "none" }}
            _expanded={{ bg: "none", fontWeight: "bold" }}
            p={0}
            // onClick={(e) => handleExpandSection(e, sectionIndex)}
          >
            <Flex width={"100%"} grow={2} align="center">
              <Flex grow={2} align="center">
                <Box as="span" marginRight="4" fontSize="lg" fontWeight="bold">
                  &bull;
                </Box>

                <Text as="span" fontSize="lg" fontWeight="semibold">
                  {uiSection.getSectionName()}
                </Text>
              </Flex>
            </Flex>
          </AccordionButton>
        </h2>

        <AccordionPanel pb={4} pl={10}>
          {uiSection?.getUITasks().map((task, taskIndex) => (
            <Task
              taskIndex={taskIndex}
              uiTask={task}
              updateTaskXML={updateTaskXML}
            />
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

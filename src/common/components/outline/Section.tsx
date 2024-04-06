import React, { useState, useRef } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import { MdMoreVert, MdEdit, MdDelete, MdAdd } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

import { Task } from "common/components/outline/Task";
import { SectionV2 as TSectionV2 } from "types";

import "./Section.css";

type Props = {
  sectionIndex: number;
  defaultEditing?: boolean;
  section: TSectionV2;
  checkingDisabled: boolean;
  setSections: React.Dispatch<React.SetStateAction<TSectionV2[]>>;
  setExpandedSectionIndices: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Section: React.FC<Props> = ({
  defaultEditing,
  sectionIndex,
  section,
  checkingDisabled,
  setSections,
  setExpandedSectionIndices,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [sectionTitle, setSectionTitle] = useState(section?.title || "");
  const [isEditing, setIsEditing] = useState(defaultEditing);

  const handleExpandSection = (e: any, sectionIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSectionIndices((prev) => {
      if (prev.includes(sectionIndex)) {
        return prev.filter((index) => index !== sectionIndex);
      }
      return [...prev, sectionIndex];
    });
  };

  const handleEdit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSections((prev: TSectionV2[]) => {
      const newSections = [...prev];
      newSections.splice(sectionIndex, 1);
      return newSections;
    });
  };

  const handleAddTask = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSections((prev: TSectionV2[]) => {
      const newSections = [...prev];
      newSections[sectionIndex].tasks.push({
        text: "",
        is_action_item: false,
      });
      return newSections;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      setSections((prev: TSectionV2[]) => {
        const newSections = [...prev];
        newSections[sectionIndex].title = sectionTitle;
        return newSections;
      });
      setIsEditing(false);
    } else if (e.key === "Space") {
      e.preventDefault();
      e.stopPropagation();
      //   setSectionTitle(e.target.value);
    }
  };

  if (!section) {
    return null;
  }

  return (
    <AccordionItem key={sectionIndex} border="none">
      <h2>
        <AccordionButton
          className="section-btn"
          _hover={{ bg: "none" }}
          _focus={{ boxShadow: "none" }}
          _expanded={{ bg: "none", fontWeight: "bold" }}
          p={0}
          onClick={(e) => handleExpandSection(e, sectionIndex)}
        >
          <Flex width={"100%"} grow={2} align="center">
            <Flex grow={2} align="center">
              <Box as="span" marginRight="4" fontSize="lg" fontWeight="bold">
                &bull;
              </Box>
              {isEditing ? (
                <Textarea
                  ml={1}
                  ref={textAreaRef}
                  minH="unset"
                  overflow="hidden"
                  w="100%"
                  resize="none"
                  minRows={1}
                  py={0}
                  as={ResizeTextarea}
                  className="deepee-text-area"
                  fontSize={"small"}
                  variant="unstyled"
                  value={sectionTitle}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSectionTitle(e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <Text as="span" fontSize="lg" fontWeight="semibold">
                  {sectionTitle}
                </Text>
              )}
            </Flex>
            <Popover trigger="hover" placement="right">
              <PopoverTrigger>
                <Box>
                  <Box className="actions">
                    <MdMoreVert
                      cursor={"pointer"}
                      size={24}
                      color={"#A0AEC0"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                  </Box>
                  <span className="hidden-actions-span"></span>
                </Box>
              </PopoverTrigger>
              <PopoverContent>
                <Flex align={"center"} p={1} onClick={handleEdit}>
                  <MdEdit /> <Text ml="8px">Edit</Text>
                </Flex>
                <Flex align={"center"} p={1} onClick={handleDelete}>
                  <MdDelete /> <Text ml="8px">Delete</Text>
                </Flex>

                <Flex align={"center"} p={1} onClick={handleAddTask}>
                  <MdAdd /> <Text ml="8px">Add Task</Text>
                </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        </AccordionButton>
      </h2>

      <AccordionPanel pb={4} pl={10}>
        {section?.tasks.map((task, taskIndex) => (
          <Task
            key={taskIndex}
            defaultEditing={false}
            sectionIndex={sectionIndex}
            taskIndex={taskIndex}
            task={task}
            checkingDisabled={checkingDisabled}
            setSections={setSections}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};

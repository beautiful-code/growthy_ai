import React, { useState, useRef } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Text,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import { MdMoreVert, MdEdit, MdDelete } from "react-icons/md";

import { SectionV2 as TSectionV2, TaskV2 as TTaskV2 } from "types";

import "./Task.css";

type Props = {
  defaultEditing: boolean;
  sectionIndex: number;
  taskIndex: number;
  task: TTaskV2;
  checkingDisabled: boolean;
  setSections: React.Dispatch<React.SetStateAction<TSectionV2[]>>;
};

export const Task: React.FC<Props> = ({
  defaultEditing,
  sectionIndex,
  taskIndex,
  task,
  checkingDisabled,
  setSections,
}) => {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [taskText, setTaskText] = useState(task.text);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
      newSections[sectionIndex].tasks.splice(taskIndex, 1);
      return newSections;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      setSections((prev: TSectionV2[]) => {
        const newSections = [...prev];
        newSections[sectionIndex].tasks[taskIndex].text = taskText;
        return newSections;
      });
      setIsEditing(false);
    }
  };

  return (
    <Flex align={"center"} className="task">
      <Flex grow={2} key={taskIndex} align="center">
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
            value={taskText}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTaskText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Box>
            {task.is_action_item ? (
              <Flex>
                <Checkbox size="md" disabled={checkingDisabled} />
                <Text ml={4}>{task.text}</Text>
              </Flex>
            ) : (
              <Text>{task.text}</Text>
            )}
          </Box>
        )}
      </Flex>
      <Popover trigger="hover" placement="right">
        <PopoverTrigger>
          <Box>
            <Box className="actions">
              <MdMoreVert cursor={"pointer"} size={24} color={"#A0AEC0"} />
            </Box>
            <span className="hidden-actions-span"></span>
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <Flex align={"center"} p={1} cursor={"pointer"} onClick={handleEdit}>
            <MdEdit /> <Text ml="8px">Edit</Text>
          </Flex>
          <Flex
            cursor={"pointer"}
            align={"center"}
            p={1}
            onClick={handleDelete}
          >
            <MdDelete /> <Text ml="8px">Delete</Text>
          </Flex>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

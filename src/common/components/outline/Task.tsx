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

import { domainUpdateAndCallback } from "common/utils";
import ResizeTextarea from "react-textarea-autosize";
import { MdMoreVert, MdEdit } from "react-icons/md";
import { UITask } from "domain/common/UITask";

export type TaskProps = {
  uiTask: UITask;
  checkingEnabled?: boolean;
  taskSelectionEnabled?: boolean;
  onUpdateTaskCallback: (uiTask: UITask) => void;
  handleSelectTask: (taskId: string) => void;
};

export const Task: React.FC<TaskProps> = ({
  uiTask,
  checkingEnabled = false,
  taskSelectionEnabled = false,
  onUpdateTaskCallback,
  handleSelectTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskText, setTaskText] = useState(uiTask.getText());
  const [taskChecked, setTaskChecked] = useState(uiTask.getChecked());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleEdit = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      domainUpdateAndCallback(
        uiTask,
        "updateText",
        [taskText],
        onUpdateTaskCallback
      );
      setIsEditing(false);
    }
  };

  const handleTaskCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setTaskChecked(e.target.checked); // React state update to re-render the component

    // TODO: Wrap in one call
    domainUpdateAndCallback(
      uiTask,
      "updateChecked",
      [e.target.checked],
      onUpdateTaskCallback
    );
  };

  const isSelected = taskSelectionEnabled && uiTask.getIsSelected();

  return (
    <Flex align={"center"} className="task">
      <Flex grow={2} align="center">
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
            onKeyDown={handleEnterKey}
          />
        ) : (
          <Box>
            <Flex>
              <Checkbox
                size="md"
                disabled={!checkingEnabled}
                isChecked={taskChecked}
                onChange={(e) => {
                  handleTaskCheck(e);
                }}
              />
              <Text
                ml={4}
                color={isSelected ? "blue.500" : ""}
                cursor={taskSelectionEnabled ? "pointer" : "default"}
                onClick={() => {
                  handleSelectTask(uiTask.getUUID());
                }}
              >
                {uiTask.getText()}
              </Text>
            </Flex>
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
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

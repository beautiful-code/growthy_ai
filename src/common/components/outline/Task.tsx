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
import { UITask } from "domain/blog-article/UITask";


type Props = {
  // taskIndex: number;
  uiTask: UITask;
  onUpdateTaskCallback: (uiTask: UITask) => void;
  //updateTaskXML: (taskIndex: number, taskXML: string) => void;
};

export const Task: React.FC<Props> = ({ uiTask, onUpdateTaskCallback }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskText, setTaskText] = useState(uiTask.getText());
  const [taskChecked, setTaskChecked] = useState(uiTask.getChecked());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleEdit = (e: any) => {
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

      domainUpdateAndCallback(uiTask, 'updateText', [taskText], onUpdateTaskCallback );
      /*
      uiTask.updateText(taskText);
      onUpdateTaskCallback(uiTask);
      */
      //updateTaskXML(taskIndex, uiTask._xml);

      setIsEditing(false);
    }
  };

  const handleTaskCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setTaskChecked(e.target.checked); // React state update to re-render the component

    /*
    // Domain Object update and callback go hand in hand.
    uiTask.updateChecked(e.target.checked); // Domain object update
    onUpdateTaskCallback(uiTask); // Callback to update parent
    */

    // TODO: Wrap in one call
    domainUpdateAndCallback(uiTask, 'updateChecked', [e.target.checked], onUpdateTaskCallback );
    //updateTaskXML(taskIndex, uiTask._xml);
  };



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
                isChecked={taskChecked}
                onChange={(e) => {
                  handleTaskCheck(e)
                }}
              />
              <Text ml={4}>{uiTask.getText()}</Text>
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

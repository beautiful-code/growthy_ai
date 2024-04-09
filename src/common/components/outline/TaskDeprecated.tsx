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

import { BlogArticle } from "domain/blog-article/BlogArticleV2";
import { TaskV2 as TTaskV2 } from "types";

import "./Task.css";

type Props = {
  sectionIndex: number;
  taskIndex: number;
  task: TTaskV2;
  blogArticle: BlogArticle;
  checkingDisabled: boolean;
  setBlogArticleXml: (xml: string) => void;
};

export const Task: React.FC<Props> = ({
  sectionIndex,
  taskIndex,
  task,
  blogArticle,
  checkingDisabled,
  setBlogArticleXml,
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
    blogArticle.deleteTask(sectionIndex, taskIndex);
    setBlogArticleXml(blogArticle.blogArticleXml);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      blogArticle.updateTask(sectionIndex, taskIndex, {
        text: taskText,
        is_action_item: task.is_action_item,
      });
      setBlogArticleXml(blogArticle.blogArticleXml);
      setIsEditing(false);
    }
  };

  const handleTaskCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    blogArticle.updateTask(sectionIndex, taskIndex, {
      text: task.text,
      is_action_item: e.target.checked,
    });
    setBlogArticleXml(blogArticle.blogArticleXml);
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
                <Checkbox
                  size="md"
                  disabled={checkingDisabled}
                  onChange={handleTaskCheck}
                />
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

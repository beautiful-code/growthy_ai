import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Text,
  AccordionButton,
  AccordionPanel,
  Textarea,
} from "@chakra-ui/react";
import {
  // MdChevronRight,
  MdMoreVert,
  MdDelete,
  MdEdit,
  MdAdd,
} from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

import { UITree } from "domain/ui-tree/UITree";
import { Node } from "domain/node/Node";
import { TGrowthExercise } from "types";
import { NodeForRender } from "domain/node-for-render/NodeForRender";
import { UINodeIcon } from "common/components/outline/ui-node/UINodeIcon";
import { UINodeText } from "common/components/outline/ui-node/UINodeText";
import { saveNode, saveNodes } from "common/components/outline/outlineQueries";

import "./UINode.css";

type Props = {
  idx: number;
  level: number;
  node: NodeForRender;
  parent: NodeForRender;
  growthExercise: TGrowthExercise | null;
  allNodes: Node[];
  areTasksClickable: boolean;
  highlightedBullet: Node | undefined;
  setAllNodes: (nodes: Node[]) => void;
  setHighlightedNode?: (node: Node) => void;
  setOpenIndex: React.Dispatch<React.SetStateAction<number[]>>;
  handleInputClick: (
    e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>,
    node: NodeForRender,
    parent: NodeForRender
  ) => void;
  handleDeleteNode: (id: string | null) => void;
  renderNode: (
    node: NodeForRender,
    level: number,
    idx: number,
    parent: NodeForRender
  ) => JSX.Element;
  setReRenderCount: React.Dispatch<React.SetStateAction<number>>;
};

export const UINode: React.FC<Props> = ({
  idx,
  node,
  parent,
  growthExercise,
  level,
  allNodes,
  highlightedBullet,
  areTasksClickable,
  setAllNodes,
  setOpenIndex,
  handleInputClick,
  handleDeleteNode,
  renderNode,
  setReRenderCount,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const addingTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAddingNewNode, setIsAddingNewNode] = useState<boolean>(false);
  const [newNodeValue, setNewNodeValue] = useState<string>("");

  const handleEditNode = () => {
    setIsEdit(!isEdit);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 100);
  };

  const handleAddTask = () => {
    setIsAddingNewNode(true);
    setTimeout(() => {
      addingTextAreaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const uiTree = new UITree(allNodes, "");

      const newNode = uiTree.addNode({
        id: uuidv4(),
        text: newNodeValue,
        parent_id: node.id,
        atIndex: idx + 1,
        is_task: false,
        growth_exercise_id: growthExercise?.id || "",
      });
      if (newNode) {
        const updatedNodes = [...allNodes, newNode];
        saveNodes(updatedNodes.map((n) => n.toTNode()));
        setTimeout(() => {
          if (newNode.id) {
            const input = document.getElementById(newNode.id);
            if (input) {
              input.focus();
            }
          }
        }, 0);
        saveNode(newNode.toTNode()).then(() => {
          setNewNodeValue("");
          setIsAddingNewNode(false);
        });
      }
    }
  };

  return (
    <Box>
      <AccordionButton width={"100%"} className="bullet-point-accordion-btn">
        <Flex width={"100%"}>
          <Flex
            grow={2}
            width={"100%"}
            align="center"
            ml={`${level * 20}px`}
            className={"bullet-point"}
            style={{
              color: node.id === highlightedBullet?.id ? "#718CEB" : "black",
            }}
          >
            <Flex
              width="100%"
              justify={"space-between"}
              grow={2}
              align="center"
            >
              <Flex grow={2} width={"100%"} align="center">
                <UINodeIcon node={node} setReRenderCount={setReRenderCount} />
                <UINodeText
                  idx={idx}
                  isEdit={isEdit}
                  node={node}
                  parent={parent}
                  growthExercise={growthExercise}
                  allNodes={allNodes}
                  areTasksClickable={areTasksClickable}
                  textAreaRef={textAreaRef}
                  setAllNodes={setAllNodes}
                  setOpenIndex={setOpenIndex}
                  handleInputClick={handleInputClick}
                  handleEditNode={handleEditNode}
                />
              </Flex>
              {Boolean(node.id) && (
                <Popover trigger="hover" placement="right">
                  <PopoverTrigger>
                    <Box>
                      <Box className="actions">
                        <MdMoreVert
                          cursor={"pointer"}
                          size={24}
                          color={"#A0AEC0"}
                        />
                      </Box>
                      <span className="hidden-actions-span"></span>
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Flex
                      align={"center"}
                      p={1}
                      onClick={() => {
                        handleEditNode();
                      }}
                    >
                      <MdEdit /> <Text ml="8px">Edit</Text>
                    </Flex>
                    <Flex
                      align={"center"}
                      p={1}
                      onClick={() => {
                        handleDeleteNode(node.id);
                      }}
                    >
                      <MdDelete /> <Text ml="8px">Delete</Text>
                    </Flex>
                    {node.children.length > 0 && (
                      <Flex
                        align={"center"}
                        p={1}
                        onClick={() => {
                          handleAddTask();
                        }}
                      >
                        <MdAdd /> <Text ml="8px">Add Task</Text>
                      </Flex>
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </Flex>
          </Flex>
        </Flex>
      </AccordionButton>
      {node.children?.length > 0 && (
        <AccordionPanel pb={4}>
          {node.children.map((child, idx) =>
            renderNode(child, level + 1, idx, node)
          )}
          {isAddingNewNode && (
            <Textarea
              ml={1}
              ref={addingTextAreaRef}
              minH="unset"
              overflow="hidden"
              w="100%"
              resize="none"
              minRows={1}
              py={0}
              as={ResizeTextarea}
              className="deepee-text-area"
              fontSize={"small"}
              id={node.id || ""}
              value={newNodeValue}
              cursor={node.is_task && areTasksClickable ? "pointer" : "text"}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNewNodeValue(e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              variant="unstyled"
            />
          )}
        </AccordionPanel>
      )}
    </Box>
  );
};

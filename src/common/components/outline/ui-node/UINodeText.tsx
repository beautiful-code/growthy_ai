import React from "react";
// import { v4 as uuidv4 } from "uuid";
import { Text, Textarea } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";

import { Node } from "domain/node/Node";
import { NodeForRender } from "domain/node-for-render/NodeForRender";
import { UITree } from "domain/ui-tree/UITree";
import { TGrowthExercise } from "types";
// import { focusAndSetSelection } from "note/noteUtils";
import {
  saveNode,
  saveNodes,
  deleteNode,
} from "common/components/outline/outlineQueries";

type Props = {
  idx: number;
  isEdit: boolean;
  node: NodeForRender;
  parent: NodeForRender;
  growthExercise: TGrowthExercise | null;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  allNodes: Node[];
  areTasksClickable: boolean;
  setAllNodes: (nodes: Node[]) => void;
  setOpenIndex: React.Dispatch<React.SetStateAction<number[]>>;
  handleInputClick: (
    e: any,
    node: NodeForRender,
    parent: NodeForRender
  ) => void;
  handleEditNode: () => void;
};

export const UINodeText: React.FC<Props> = ({
  isEdit,
  areTasksClickable,
  node,
  parent,
  allNodes,
  textAreaRef,
  setAllNodes,
  handleInputClick,
  handleEditNode,
}) => {
  const handleBulletText = (id: string | null, text: string) => {
    if (!areTasksClickable) {
      const updatedBulletNodes = allNodes.map((n) => {
        if (n.id === id) {
          return new Node({
            id: n.id,
            text,
            parent_id: n.parent_id,
            rel_order: n.rel_order,
            is_task: n.is_task,
            is_checked: n.is_checked,
            growth_exercise_id: n.growth_exercise_id,
          });
        }
        return n;
      });
      setAllNodes(updatedBulletNodes);
    } else {
      const currentNode = allNodes.find((n) => n.id === id);

      if (!currentNode) {
        return;
      }

      let isTask = false;
      if (text.includes("[]")) {
        isTask = true;
        text = text.replace("[]", "");
      } else {
        isTask = currentNode.is_task;
      }
      currentNode.text = text;
      const updatedBulletNodes = allNodes.map((n) => {
        if (n.id === id) {
          n.text = text;
          n.is_task = isTask;
          return n;
        }
        return n;
      });

      setAllNodes(updatedBulletNodes);
      if (currentNode && currentNode.id) {
        saveNode(currentNode.toTNode());
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    id: string | null
    // idx: number,
    // parent_id?: string | null
  ) => {
    if (!id) {
      return;
    }
    const uiTree = new UITree(allNodes, id);
    switch (e.key) {
      case "Enter": {
        e.preventDefault();

        handleEditNode();
        break;
      }
      case "Backspace": {
        if (e.currentTarget.value === "") {
          e.preventDefault();

          const { deletedNode, updatedNodes, selectedBulletId } =
            uiTree.removeNode(id);
          if (deletedNode && deletedNode.id) {
            const updatedNodeIds = updatedNodes.map((node) => node.id);
            let updatedNodeItems = allNodes.filter(
              (n) => n.id !== deletedNode.id
            );
            updatedNodeItems = updatedNodeItems.map((bulletNode) => {
              if (updatedNodeIds.includes(bulletNode.id)) {
                const updatedNode = updatedNodes.find(
                  (node) => node.id === bulletNode.id
                );
                return updatedNode as Node;
              } else {
                return bulletNode;
              }
            });
            saveNodes(updatedNodeItems?.map((node) => node.toTNode()));
            if (areTasksClickable) {
              deleteNode(deletedNode.id);
              saveNodes(updatedNodes?.map((n) => n.toTNode()));
            }

            setTimeout(() => {
              if (selectedBulletId) {
                const input = document.getElementById(
                  selectedBulletId
                ) as HTMLTextAreaElement;
                if (input) {
                  input.focus();

                  const contentLength = input?.value?.length || 0;
                  input.setSelectionRange(contentLength, contentLength);

                  // Using requestAnimationFrame for better timing control
                  requestAnimationFrame(() => {
                    input.setSelectionRange(contentLength, contentLength);
                  });
                }
              }
            }, 200);
          }
        }
        break;
      }
      case "Tab": {
        e.preventDefault();
        if (e.shiftKey) {
          const outdentedNode = uiTree.outdentNode(id);
          if (outdentedNode) {
            const updatedBulletNodes = allNodes.map((n) => {
              if (n.id === outdentedNode.id) {
                return outdentedNode;
              }
              return n;
            });
            setAllNodes(updatedBulletNodes);
            saveNode(outdentedNode.toTNode());
            setTimeout(() => {
              if (outdentedNode.id) {
                const input = document.getElementById(outdentedNode.id);
                if (input) {
                  input.focus();
                }
              }
            }, 100);
          }
        } else {
          const indentedNode = uiTree.indentNode(id);
          if (indentedNode) {
            const updatedBulletNodes = allNodes.map((n) => {
              if (n.id === indentedNode.id) {
                return indentedNode;
              }
              return n;
            });
            setAllNodes(updatedBulletNodes);
            saveNode(indentedNode.toTNode());
            setTimeout(() => {
              if (indentedNode.id) {
                const input = document.getElementById(indentedNode.id);
                if (input) {
                  input.focus();
                }
              }
            }, 100);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  if (isEdit) {
    return (
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
        id={node.id || ""}
        value={node.text}
        cursor={node.is_task && areTasksClickable ? "pointer" : "text"}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleBulletText(node.id, e.target.value);
        }}
        onClick={(e) => handleInputClick(e, node, parent)}
        onKeyDown={(e) => handleKeyDown(e, node.id)}
        variant="unstyled"
      />
    );
  }

  return (
    <Text
      width={"100%"}
      ml="4px"
      textAlign={"left"}
      fontSize={"small"}
      onClick={(e) => handleInputClick(e, node, parent)}
    >
      {node.text}
    </Text>
  );
};

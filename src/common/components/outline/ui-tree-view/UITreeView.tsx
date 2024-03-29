import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Flex,
  Text,
  Spinner,
  Accordion,
  AccordionItem,
} from "@chakra-ui/react";

import { Node } from "domain/node/Node";
import { NodeForRender } from "domain/node-for-render/NodeForRender";
import { UITree } from "domain/ui-tree/UITree";
import { UINode } from "common/components/outline/ui-node/UINode";
import { TGrowthExercise } from "types";
import {
  getNodes,
  saveNode,
  deleteNodes,
} from "common/components/outline/outlineQueries";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";

import "./UITreeView.css";

type Props = {
  loading: boolean;
  showModifyOutlineButton?: boolean;
  highlightedBullet?: Node;
  areTasksClickable: boolean;
  shouldSelectFirstNode: boolean;
  growthExercise: TGrowthExercise | null;
  shouldLoadInitialBullets: boolean;
  editingNode: NodeForRender | null;
  allNodes: Node[];
  setAllNodes: (nodes: Node[]) => void;
  setEditingNode: (node: NodeForRender | null) => void;
  setHighlightedNode?: (node: Node) => void;
  setHighlightedParent?: (node: Node) => void;
  setHelperType?: (
    helperType: "" | "assistant" | "assistant-ideas" | "publish"
  ) => void;
};

export const UITreeView: React.FC<Props> = ({
  loading,
  showModifyOutlineButton,
  highlightedBullet,
  areTasksClickable = true,
  shouldLoadInitialBullets = true,
  shouldSelectFirstNode = false,
  growthExercise,
  editingNode,
  allNodes,
  setAllNodes,
  setHighlightedNode,
  setHighlightedParent,
  setHelperType,
}) => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number[]>([]);
  const [reRenderCount, setReRenderCount] = useState<number>(0);

  useEffect(() => {
    if (loading || !growthExercise || !shouldLoadInitialBullets) {
      return;
    }

    getNodes(growthExercise?.id).then(({ data }) => {
      const rootNode = new Node({
        id: null,
        text: "",
        parent_id: null,
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: growthExercise?.id || "",
      });
      if (!data || data?.length === 0) {
        const newNode = new Node({
          id: uuidv4(),
          text: "",
          parent_id: null,
          rel_order: 1,
          is_task: true,
          is_checked: false,
          growth_exercise_id: growthExercise?.id || "",
        });
        setAllNodes([rootNode, newNode]);
        saveNode(newNode.toTNode());
      } else {
        const nodeObjects = data.map((n) => {
          return new Node({
            id: n.id,
            text: n.text,
            parent_id: n.parent_id,
            rel_order: n.rel_order,
            is_task: n.is_task,
            is_checked: n.is_checked,
            growth_exercise_id: n.growth_exercise_id,
          });
        });
        const allNodeObjs = [rootNode, ...nodeObjects];
        setAllNodes(allNodeObjs);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, reRenderCount]);

  const renderTree = UITree.buildTree(allNodes);

  useEffect(() => {
    if (loading || !shouldSelectFirstNode) {
      return;
    }

    const firstParent =
      renderTree.children && renderTree.children.length > 0
        ? renderTree.children[0]
        : null;
    const firstTask =
      firstParent?.children && firstParent.children.length > 0
        ? firstParent.children[0]
        : null;
    if (!highlightedBullet?.id && firstTask && firstParent) {
      handleInputClick({}, firstParent, renderTree);
      handleInputClick({}, firstTask, firstParent);
    }
  }, [loading, renderTree]);

  useEffect(() => {
    // Attempt to force resize of textareas after state update
    // Note: This is a hacky solution and might not work in all cases
    openIndex.forEach((_index) => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    });
  }, [openIndex]);

  const handleInputClick = (
    _e: any,
    nodeForRender: NodeForRender,
    parent: NodeForRender
  ) => {
    if (!nodeForRender.id) {
      return;
    }

    setOpenIndex((prevOpenIndex) => {
      if (prevOpenIndex.includes(nodeForRender.pos_index)) {
        return prevOpenIndex.filter(
          (index) => index !== nodeForRender.pos_index
        );
      } else {
        return [...prevOpenIndex, nodeForRender.pos_index];
      }
    });

    if (!nodeForRender.is_task || !areTasksClickable) {
      return;
    }

    const node = nodeForRender.toNode();

    if (setHighlightedNode) {
      setHighlightedNode(node);
    }
    if (setHighlightedParent) {
      setHighlightedParent(parent.toNode());
    }
    if (setHelperType) {
      setHelperType("");
    }
  };

  const handleDeleteNode = (id: string | null) => {
    const uiTree = new UITree(allNodes, id);
    const deletedNodes = uiTree.deleteNode(id);

    if (deletedNodes.length === 0) {
      return;
    }

    const deletedNodeIds = deletedNodes.map((node) => node.id);
    const updatedNodes = allNodes.filter(
      (bulletNode: Node) => !deletedNodeIds.includes(bulletNode.id)
    );
    setAllNodes(updatedNodes);
    deleteNodes(deletedNodes.map((node) => node.id || ""));
  };

  const handleNavigateToModify = () => {
    navigate(`/modify-outline/${growthExercise?.id}`);
  };

  const renderNode = (
    node: NodeForRender,
    level: number = 0,
    idx: number,
    parent: NodeForRender
  ) => {
    return (
      <AccordionItem
        px={0}
        key={node.id}
        id={node.id || ""}
        className={editingNode?.id === node.id ? "selected-editing-bullet" : ""}
        border={"none"}
      >
        <UINode
          idx={idx}
          node={node}
          parent={parent}
          level={level}
          highlightedBullet={highlightedBullet}
          growthExercise={growthExercise}
          allNodes={allNodes}
          areTasksClickable={areTasksClickable}
          setAllNodes={setAllNodes}
          setOpenIndex={setOpenIndex}
          handleInputClick={handleInputClick}
          handleDeleteNode={handleDeleteNode}
          renderNode={renderNode}
          setReRenderCount={setReRenderCount}
        />
      </AccordionItem>
    );
  };

  if (loading) {
    return (
      <Box my="20px">
        <Text>Preparing everything...</Text>
        <Spinner fontSize={"18px"} />
      </Box>
    );
  }

  const handleExpandAll = () => {
    setOpenIndex(Array.from({ length: allNodes.length }).map((_, idx) => idx));
  };

  const handleCollapseAll = () => {
    setOpenIndex([]);
  };

  return (
    <Box>
      <Accordion px={0} allowMultiple index={openIndex} onChange={() => {}}>
        {renderTree.children.map((child: NodeForRender, idx) =>
          renderNode(child, 0, idx, renderTree)
        )}
      </Accordion>
      <Flex justify={"flex-end"}>
        <Button
          size="xs"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleExpandAll}
        >
          Expand all
        </Button>
        <Button
          size="xs"
          ml="8px"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleCollapseAll}
        >
          Collapse all
        </Button>
      </Flex>
      {showModifyOutlineButton && (
        <Flex justify={"flex-end"}>
          <Button
            mt="8px"
            size="xs"
            border="1px solid #E2E8F0"
            backgroundColor={"white"}
            color={"primary.500"}
            onClick={handleNavigateToModify}
          >
            Modify Outline
          </Button>
        </Flex>
      )}
    </Box>
  );
};

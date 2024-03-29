import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { UITreeView } from "common/components/outline/ui-tree-view/UITreeView";

import { Node } from "domain/node/Node";
import { NodeForRender } from "domain/node-for-render/NodeForRender";
import { TSuggestedGrowthExercise } from "types";

type Props = {
  suggestedGrowthExercise: TSuggestedGrowthExercise | null;
  allNodes: Node[];
  setAllNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

export const OutlineWrapper: React.FC<Props> = ({
  suggestedGrowthExercise,
  allNodes,
  setAllNodes,
}) => {
  const [editingNode, setEditingNode] = useState<NodeForRender | null>(null);

  useEffect(() => {
    const outlineLength = suggestedGrowthExercise?.outline?.length || 0;
    if (!outlineLength && outlineLength === 0) {
      return;
    }

    setAllNodes(suggestedGrowthExercise?.outline || []);
  }, []);

  return (
    <Box>
      <UITreeView
        shouldLoadInitialBullets={false}
        areTasksClickable={false}
        shouldSelectFirstNode={false}
        growthExercise={{
          ...suggestedGrowthExercise,
          id: suggestedGrowthExercise?.id || "",
          title: suggestedGrowthExercise?.title || "",
          inputs: {},
          state: "created",
          user_id: "",
          guild_id: "",
          type: "blog-article",
        }}
        loading={false}
        editingNode={editingNode}
        setEditingNode={setEditingNode}
        allNodes={allNodes}
        setAllNodes={setAllNodes}
      />
    </Box>
  );
};

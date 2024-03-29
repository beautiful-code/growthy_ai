import React, {
  // useState,
  useEffect,
} from "react";
import { Box } from "@chakra-ui/react";
// import { BulletListV2 } from "bullet-list/list-view/BulletListV2";

import { Node } from "domain/node/Node";
// import { NodeForRender } from "domain/node-for-render/NodeForRender";
// import { saveBulletListItems } from "bullet-list/bulletListQueries";
import { TSuggestedIdea } from "types";

type Props = {
  specialisationId: string;
  idea: TSuggestedIdea | null;
  bulletNodes: Node[];
  setBulletNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

export const OutlineWrapper: React.FC<Props> = ({
  //   specialisationId,
  idea,
  //   bulletNodes,
  //   setBulletNodes,
}) => {
  //   const [editingBullet, setEditingBullet] = useState<NodeForRender | null>(
  //     null
  //   );

  useEffect(() => {
    const outlineLength = idea?.outline?.length || 0;
    if (!outlineLength && outlineLength === 0) {
      return;
    }

    // setBulletNodes(idea?.outline || []);
    // saveBulletListItems(outlineNodes);
  }, []);

  return (
    <Box>
      {/* <BulletListV2
        shouldLoadInitialBullets={false}
        areActionItemsClickable={false}
        shouldSelectFirstNode={false}
        idea={{
          ...idea,
          id: idea?.id || "",
          title: idea?.title || "",
          about: idea?.summary || "",
          benefits_for_readers: idea?.benefits || "",
          benefits_for_you: idea?.benefits || "",
          specialisation_id: specialisationId,
          type: "growth-exercise",
        }}
        loading={false}
        editingBullet={editingBullet}
        bulletNodes={bulletNodes}
        setBulletNodes={setBulletNodes}
        setEditingBullet={setEditingBullet}
      /> */}
    </Box>
  );
};

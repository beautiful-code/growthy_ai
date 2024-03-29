import React, { useState, useEffect } from "react";
import { Checkbox, CircularProgress } from "@chakra-ui/react";

import { NodeForRender } from "domain/node-for-render/NodeForRender";

import { saveNode } from "common/components/outline/outlineQueries";

// @ts-expect-error: Svg import
import SectionNoContent from "assets/SectionNoContent.svg?react";
// @ts-expect-error: Svg import
import SectionFilled from "assets/SectionFilled.svg?react";

type TNodeIconProps = {
  node: NodeForRender;
  setReRenderCount: React.Dispatch<React.SetStateAction<number>>;
};

export const UINodeIcon: React.FC<TNodeIconProps> = ({
  node,
  setReRenderCount,
}) => {
  const isTask = node.is_task;
  const isSection = node.children.length > 0;
  const [isChecked, setIsChecked] = useState(node.is_checked);

  useEffect(() => {
    setIsChecked(node.is_checked);
  }, [node.is_checked]);

  const handleChecked = () => {
    setIsChecked(!isChecked);
    node.is_checked = !isChecked;
    saveNode(node.toTNode()).then(() => {
      setReRenderCount((prev) => prev + 1);
    });
  };

  if (isTask) {
    return (
      <Checkbox
        mr="4px"
        className="action-item-checkbox"
        isChecked={isChecked}
        onChange={handleChecked}
      />
    );
  }

  if (isSection) {
    const filledSections = node.children.filter((child) => child.is_checked);

    const percentageCompleted =
      (filledSections.length / node.children.length) * 100;

    return (
      <CircularProgress
        color="#0B870B"
        value={percentageCompleted}
        size="24px"
      />
    );
  }
};

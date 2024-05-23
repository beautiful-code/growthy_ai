import React from "react";
import { Range } from "slate";
import { RenderLeafProps } from "slate-react";

type LeafProps = {
  renderLeafProps: RenderLeafProps;
  selections: Range[];
};

export const Leaf: React.FC<LeafProps> = ({
  renderLeafProps: { leaf, attributes, children },
  selections,
}) => {
  console.log({ selections, leaf, attributes, children });
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.comment) {
    children = <span style={{ backgroundColor: "yellow" }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

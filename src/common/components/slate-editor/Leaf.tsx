import React from "react";
import { Range } from "slate";

type LeafProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leaf: any;
  selections: Range[];
};

export const Leaf: React.FC<LeafProps> = ({
  attributes,
  children,
  leaf,
  selections,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (
    selections.some(
      (selection) =>
        selection.anchor.offset === leaf.text.anchor &&
        selection.focus.offset === leaf.text.focus
    )
  ) {
    children = <span style={{ backgroundColor: "yellow" }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

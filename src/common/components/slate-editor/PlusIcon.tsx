import React from "react";
import ReactDOM from "react-dom";
import { Range } from "slate";
import { ReactEditor } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

export interface CustomRange extends Range {
  color?: string;
}

export const PlusIcon: React.FC<{
  selection: CustomRange;
  editor: ReactEditor;
  onClick: () => void;
}> = ({ selection, editor, onClick }) => {
  try {
    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();

    return ReactDOM.createPortal(
      <IconButton
        style={{
          position: "absolute",
          top: `${rect.top + window.scrollY}px`,
          left: "70%",
          transform: "translate(-50%, -40%)",
        }}
        icon={<FiPlus />}
        aria-label="Add Comment"
        onClick={onClick}
      />,
      document.body
    );
  } catch (e) {
    console.error("Error in PlusIcon: ", e);
    return null;
  }
};

import React from "react";
import ReactDOM from "react-dom";
import { ReactEditor } from "slate-react";
import { Box, Textarea } from "@chakra-ui/react";

import { CustomRange } from "./PlusIcon";

export const CommentBox: React.FC<{
  selection: CustomRange;
  editor: ReactEditor;
}> = ({ selection, editor }) => {
  try {
    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();

    return ReactDOM.createPortal(
      <Box
        style={{
          position: "absolute",
          top: `${rect.top + window.scrollY}px`,
          left: `70%`,
          width: "300px",
          padding: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "4px",
        }}
        className="comment-box"
      >
        <Textarea placeholder="Add a comment..." rows={3} width="100%" />
      </Box>,
      document.body
    );
  } catch (e) {
    console.error("Error in CommentBox: ", e);
    return null;
  }
};

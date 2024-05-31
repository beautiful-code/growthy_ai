import React, { useEffect, useState, useCallback } from "react";
import { BaseRange } from "slate";
import { ReactEditor } from "slate-react";
import { Portal, Textarea } from "@chakra-ui/react";
import { CustomElement } from "./SlateEditor";

type CommentsProps = {
  editor: ReactEditor;
};

type Comment = {
  commentId: string;
  text: string;
};

type Selection = {
  selection: BaseRange;
  commentId: string;
};

type Position = {
  top: number;
  left: number;
  commentId: string;
};

export const Comments: React.FC<CommentsProps> = ({ editor }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const updatePositions = useCallback(() => {
    try {
      const selections: Selection[] = [];
      const newPositions: Position[] = [];
      const children = editor.children;
      // Fetch selections whose comment property is present
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as CustomElement;
        child.children.forEach((ch, index) => {
          if (ch.comment) {
            setComments([...comments, { commentId: ch.comment, text: "" }]);
            selections.push({
              selection: {
                anchor: { path: [i, index], offset: 0 },
                focus: { path: [i, index], offset: 0 },
              },
              commentId: ch.comment,
            });
          }
        });
      }

      selections.forEach((sel) => {
        const domRange = ReactEditor.toDOMRange(editor, sel.selection);
        const rect = domRange.getBoundingClientRect();

        let top = rect.top - 40 + window.scrollY;
        const left = rect.right + window.scrollX;

        for (let i = 0; i < newPositions.length; i++) {
          const pos = newPositions[i];
          if (Math.abs(pos.top - top) < 75) {
            top = pos.top + 50 + 50; //50px gap between comments
          }
        }

        newPositions.push({ top, left, commentId: sel.commentId });
      });
      setPositions(newPositions);
    } catch (error) {
      console.error("Error while updating comment positions:", error);
    }
  }, [editor]);

  useEffect(() => {
    updatePositions();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Backspace") {
        updatePositions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor.selection, updatePositions]);

  const handleCommentChange = (commentId: string, text: string) => {
    setComments(
      comments.map((c) => (c.commentId === commentId ? { commentId, text } : c))
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {positions.map((position, index) => (
        <Portal key={index}>
          <div
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `70%`,
              backgroundColor: "white",
              padding: "5px",
              zIndex: 10,
            }}
          >
            <Textarea
              placeholder="Add a comment..."
              resize="none"
              focusBorderColor="black.500"
              onChange={(e) =>
                handleCommentChange(position.commentId, e.target.value)
              }
            />
          </div>
        </Portal>
      ))}
    </div>
  );
};

import React, { useEffect, useState, useCallback } from "react";
import { BaseRange } from "slate";
import { ReactEditor } from "slate-react";
import { Portal, Textarea } from "@chakra-ui/react";
import { CustomElement } from "./SlateEditor";

type CommentsProps = {
  editor: ReactEditor;
};

export const Comments: React.FC<CommentsProps> = ({ editor }) => {
  const [positions, setPositions] = useState<{ top: number; left: number }[]>(
    []
  );

  const updatePositions = useCallback(() => {
    try {
      const selections: BaseRange[] = [];
      const newPositions: { top: number; left: number }[] = [];
      const children = editor.children;
      // Fetch selections whose comment property is true
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as CustomElement;
        child.children.forEach((ch, index) => {
          if (ch.comment) {
            selections.push({anchor: {path: [i, index], offset: 0}, focus: {path: [i, index], offset: 0}})
          }
        })
      }

      selections.forEach((sel) => {
        const domRange = ReactEditor.toDOMRange(editor, sel);
        const rect = domRange.getBoundingClientRect();

        let top = rect.top - 40 + window.scrollY;
        const left = rect.right + window.scrollX;

        for (let i = 0; i < newPositions.length; i++) {
          const pos = newPositions[i];
          if (Math.abs(pos.top - top) < 75) {
            top = pos.top + 50 + 50; //50px gap between comments
          }
        }

        newPositions.push({ top, left });
      });
      setPositions(newPositions);
    } catch (error) {
      console.error('Error while updating comment positions:', error);
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
            />
          </div>
        </Portal>
      ))}
    </div>
  );
};

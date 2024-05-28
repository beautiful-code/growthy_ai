import React, { useEffect, useState, useCallback } from "react";
import { Range } from "slate";
import { ReactEditor } from "slate-react";
import { Portal, Textarea } from "@chakra-ui/react";

type CommentsProps = {
  selections: Range[];
  editor: ReactEditor;
};

export const Comments: React.FC<CommentsProps> = ({ selections, editor }) => {
  const [positions, setPositions] = useState<{ top: number; left: number }[]>(
    []
  );

  const updatePositions = useCallback(() => {
    const newPositions: { top: number; left: number }[] = [];
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
  }, [editor, selections]);

  useEffect(() => {
    updatePositions();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        updatePositions();
      }
    };

    window.addEventListener("scroll", updatePositions);
    window.addEventListener("resize", updatePositions);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", updatePositions);
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updatePositions]);

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

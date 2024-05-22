import React, { useEffect, useState } from "react";
import { Range } from "slate";
import { Portal } from "@chakra-ui/react";

type CommentsProps = {
  selections: Range[];
  editorRef: React.RefObject<HTMLDivElement>;
};

export const Comments: React.FC<CommentsProps> = ({ selections }) => {
  const [positions, setPositions] = useState<{ top: number; left: number }[]>(
    []
  );

  useEffect(() => {
    const newPositions = selections.map(() => {
      const domRange = window.getSelection()?.getRangeAt(0);
      const rect = domRange?.getBoundingClientRect();
      return {
        top: rect?.top || 0 + window.scrollY,
        left: rect?.left || 0 + window.scrollX,
      };
    });
    setPositions(newPositions);
  }, [selections]);

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
              border: "1px solid black",
              padding: "5px",
              zIndex: 10,
            }}
          >
            Comment {index + 1}
          </div>
        </Portal>
      ))}
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createEditor, Range, Transforms, Text } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { Grid, Box } from "@chakra-ui/react";

import { Leaf } from "common/components/slate-editor/Leaf";
import { toggleFormat } from "common/components/slate-editor/utils";
import { ToolbarPopover } from "common/components/slate-editor/ToolbarPopover";
import { Comments } from "common/components/slate-editor/Comments";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  comment?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
        bold: false,
        italic: false,
        underline: false,
        comment: false,
      },
    ],
  },
];

export const SlateEditor: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const [targetRange, setTargetRange] = useState<DOMRect | null>(null);
  const [selections, setSelections] = useState<Range[]>([]);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setTargetRange(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        setShiftKeyPressed(true);
      } else if (event.ctrlKey || event.metaKey) {
        setCtrlKeyPressed(true);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift") {
        setShiftKeyPressed(false);
      } else if (!event.ctrlKey && !event.metaKey) {
        setCtrlKeyPressed(false);
      }
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editorRef]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      switch (event.key) {
        case "b": {
          event.preventDefault();
          toggleFormat(editor, "bold");
          break;
        }

        case "i": {
          event.preventDefault();
          toggleFormat(editor, "italic");
          break;
        }

        case "u": {
          event.preventDefault();
          toggleFormat(editor, "underline");
          break;
        }
      }
    },
    [editor]
  );

  const onSelect = useCallback(() => {
    const selection = window.getSelection();

    if (shiftKeyPressed || ctrlKeyPressed) {
      return;
    }

    if (selection?.rangeCount) {
      const domRange = selection.getRangeAt(0);
      if (!domRange.collapsed) {
        const rect = domRange.getBoundingClientRect();
        setTargetRange(rect);
      } else {
        setTargetRange(null);
      }
    }
  }, [shiftKeyPressed, ctrlKeyPressed]);

  const handleComment = () => {
    const { selection } = editor;
    
    if (selection && !selections.some((sel) => Range.equals(sel, selection))) {
      Transforms.setNodes(
        editor,
        { comment: true },
        { match: (n) => Text.isText(n), split: true }
      );
      setSelections([...selections, selection]);
      setTargetRange(null);
    }
  };

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      return <Leaf renderLeafProps={props} selections={selections} />;
    },
    [selections]
  );

  return (
    <Grid templateColumns="2fr 1fr" gap={4}>
      <Box ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={() => setTargetRange(null)}
        >
          <Editable
            placeholder="Enter your text here..."
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            onSelect={onSelect}
            style={{ outline: "none", border: "none" }}
          />
          {targetRange && (
            <ToolbarPopover
              editor={editor}
              targetRange={targetRange}
              toggleFormat={toggleFormat}
              setTargetRange={setTargetRange}
              handleComment={handleComment}
            />
          )}
        </Slate>
      </Box>
      <Comments selections={selections} editorRef={editorRef} />
    </Grid>
  );
};

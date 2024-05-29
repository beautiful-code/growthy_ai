import React, { useState, useEffect, useRef, useCallback } from "react";
import { createEditor, Range, Editor, Transforms } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { BaseEditor, Text } from "slate";
import { ReactEditor } from "slate-react";
import { Grid, Box, GridItem } from "@chakra-ui/react";
import { debounce } from "lodash";
import { Leaf } from "common/components/slate-editor/Leaf";
import { toggleFormat } from "common/components/slate-editor/utils";
import { ToolbarPopover } from "common/components/slate-editor/ToolbarPopover";
import { Comments } from "common/components/slate-editor/Comments";

export type CustomElement = { type: "paragraph"; children: CustomText[] };
export type CustomText = {
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

  const handlePaste = (event: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string };
  }) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("Text");
    const { selection } = editor;

    if (selection) {
      const [node] = Editor.node(editor, selection.focus.path) as [
        CustomText,
        number[],
      ];

      Transforms.insertText(editor, pastedText, { at: selection });
      if (node.comment) {
        // Set the `comment` mark on the newly inserted text
        Transforms.setNodes(
          editor,
          { comment: true },
          { at: selection, match: (n) => Text.isText(n), split: true }
        );

        const newSelections = selections.map((sel) => {
          if (
            sel.anchor.path.toString() === selection.anchor.path.toString() ||
            sel.focus.path.toString() === selection.focus.path.toString()
          ) {
            return {
              ...sel,
              focus: {
                path: sel.focus.path,
                offset: sel.focus.offset + pastedText.length,
              },
            };
          }
          return sel;
        });
        setSelections(newSelections);
      }
    }
  };

  const debounceHandleKeyDown = debounce((event: React.KeyboardEvent) => {
    if (event.key.length === 1 || ["Backspace", "Delete"].includes(event.key)) {
      event.preventDefault();
      const { selection } = editor;
      if (selections && selection) {
        let newSelections = selections.map((sel) => {
          const path = sel.anchor.path;
          const child = editor.children[path[0]] as CustomElement;
          if (child.children.length < path[1] + 1) {
            return {} as Range;
          }
          const newText = child.children[path[1]].text || "";
          return {
            ...sel,
            focus: { path: sel.focus.path, offset: newText.length },
          };
        });
        newSelections = newSelections.filter((sel) => Object.keys(sel).length);
        setSelections(newSelections);
      }
    }

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
  }, 300);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        // To prevent creating new paragraph
        event.preventDefault();
        Transforms.insertText(editor, "\n");
        return;
      }
      debounceHandleKeyDown(event);
    },
    [debounceHandleKeyDown, editor]
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
      toggleFormat(editor, "comment");
      // Fetch the updated selection from the editor
      const updatedSelection = editor.selection;
      if (updatedSelection) {
        setSelections([...selections, updatedSelection]);
      }
      setTargetRange(null);
    }
  };

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf renderLeafProps={props} />;
  }, []);

  console.log({ editor }, "selections", selections);

  return (
    <Grid templateColumns="70% 30%" gap={4}>
      <GridItem colSpan={1}>
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
              onPaste={handlePaste}
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
      </GridItem>
      <GridItem colSpan={1}>
        <Comments editor={editor} />
      </GridItem>
    </Grid>
  );
};

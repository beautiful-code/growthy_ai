import React, { useState, useEffect, useRef, useCallback } from "react";
import { createEditor, Editor, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import { BaseEditor, Text } from "slate";
import { ReactEditor } from "slate-react";
import { Grid, Box, GridItem } from "@chakra-ui/react";
import { Leaf } from "./Leaf";
import { serialize, toggleFormat } from "./utils";
import { ToolbarPopover } from "./ToolbarPopover";
import { Comments } from "./Comments";
import { v4 as uuid } from "uuid";

export type CustomElement = {
  type: "paragraph" | "code";
  children: CustomText[];
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  comment?: string;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// const initialMarkdown = `# Hello World\nThis is **bold** and *italic* text.\n\n\`\`\`code block\`\`\``;
// const initialValue = deserialize(initialMarkdown);

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
        bold: false,
        italic: false,
        underline: false,
        comment: "",
      },
    ],
  },
];

const CodeElement: React.FC<RenderElementProps> = ({
  attributes,
  children,
}) => {
  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

export const SlateEditor: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const [targetRange, setTargetRange] = useState<DOMRect | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);
  const [markdown, setMarkdown] = useState("");

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
          { comment: node.comment },
          { at: selection, match: (n) => Text.isText(n), split: true }
        );
      }
    }
  };

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        // To prevent creating new paragraph
        event.preventDefault();
        Transforms.insertText(editor, "\n");
        return;
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

        case "`": {
          event.preventDefault();
          toggleFormat(editor, "code");
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
    // Generate uuid
    const id = uuid();
    Transforms.setNodes(
      editor,
      { comment: id },
      { match: (n) => Text.isText(n), split: true }
    );

    setTargetRange(null);
  };

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf renderLeafProps={props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const handleChange = useCallback((newValue: CustomElement[]) => {
    setTargetRange(null);
    const markdownString = serialize(newValue);
    setMarkdown(markdownString);
  }, []);

  console.log({ editor, markdown });

  return (
    <Grid templateColumns="70% 30%" gap={4}>
      <GridItem colSpan={1}>
        <Box ref={editorRef}>
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(newValue) => handleChange(newValue as CustomElement[])}
          >
            <Editable
              placeholder="Enter your text here..."
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
              onSelect={onSelect}
              style={{ outline: "none", border: "none" }}
              onPaste={handlePaste}
              renderElement={renderElement}
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

import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  createEditor,
  Editor,
  Range,
  Descendant,
  BaseEditor,
  BaseElement,
  Text,
  Node,
  Path,
  Transforms,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
  useSlate,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import {
  Box,
  Flex,
  IconButton,
  ButtonGroup,
  Container,
  Grid,
  GridItem,
  Textarea,
} from "@chakra-ui/react";
import { FiBold, FiItalic, FiUnderline, FiPlus } from "react-icons/fi";

type CustomText = {
  text: string;
  highlight?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: BaseElement;
    Text: CustomText;
  }
}

interface CustomRange extends Range {
  color?: string;
}

const initialValue: Descendant[] = [{ children: [{ text: "" }] }];

export const SlateMarkdownEditor: React.FC = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [selections, setSelections] = useState<CustomRange[]>([]);
  const [commentBoxes, setCommentBoxes] = useState<CustomRange[]>([]);

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const handleMouseUp = () => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      const normalizedSelection = Editor.range(editor, selection);
      setSelections((prev) => [
        ...prev,
        { ...normalizedSelection, color: "lightblue" },
      ]);
    }
  };

  const decorate = useCallback(
    ([node, path]: [Node, Path]) => {
      const ranges: any[] = [];
      if (Text.isText(node)) {
        selections.forEach((selection) => {
          const { anchor, focus } = selection;
          const anchorPath = anchor.path;
          const focusPath = focus.path;

          if (Path.equals(anchorPath, path) || Path.equals(focusPath, path)) {
            const startOffset = Path.equals(anchorPath, path)
              ? anchor.offset
              : 0;
            const endOffset = Path.equals(focusPath, path)
              ? focus.offset
              : node.text.length;

            const adjustedRange = {
              anchor: { path, offset: startOffset },
              focus: { path, offset: endOffset },
              highlight: true,
              color: selection.color,
            };

            ranges.push(adjustedRange);
          }
        });
      }
      return ranges;
    },
    [editor, selections]
  );

  const addCommentBox = (selection: CustomRange) => {
    setCommentBoxes((prev) => [...prev, selection]);
    setSelections((prev) =>
      prev.map((sel) =>
        Range.equals(sel, selection) ? { ...sel, color: "yellow" } : sel
      )
    );
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const { selection } = editor;
        if (selection) {
          const { path } = selection.anchor;

          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          } as unknown as Node);

          const newAnchor = { path: [path[0] + 1, 0], offset: 0 };
          const newFocus = { path: [path[0] + 1, 0], offset: 0 };

          setSelections((prev) =>
            prev.map((sel) => {
              const newAnchorPath =
                sel.anchor.path[0] >= path[0]
                  ? sel.anchor.path[0] + 1
                  : sel.anchor.path[0];
              const newFocusPath =
                sel.focus.path[0] >= path[0]
                  ? sel.focus.path[0] + 1
                  : sel.focus.path[0];
              return {
                ...sel,
                anchor: {
                  ...sel.anchor,
                  path: [newAnchorPath, sel.anchor.path[1]],
                },
                focus: {
                  ...sel.focus,
                  path: [newFocusPath, sel.focus.path[1]],
                },
              };
            })
          );

          setCommentBoxes((prev) =>
            prev.map((box) => {
              const newAnchorPath =
                box.anchor.path[0] >= path[0]
                  ? box.anchor.path[0] + 1
                  : box.anchor.path[0];
              const newFocusPath =
                box.focus.path[0] >= path[0]
                  ? box.focus.path[0] + 1
                  : box.focus.path[0];
              return {
                ...box,
                anchor: {
                  ...box.anchor,
                  path: [newAnchorPath, box.anchor.path[1]],
                },
                focus: {
                  ...box.focus,
                  path: [newFocusPath, box.focus.path[1]],
                },
              };
            })
          );

          Transforms.select(editor, { anchor: newAnchor, focus: newFocus });
        }
      }
    },
    [editor]
  );

  const handleInput = useCallback(
    (event: React.FormEvent) => {
      const { selection } = editor;
      if (!selection) return;

      const text = (event.nativeEvent as InputEvent).data || "";
      const { path, offset } = selection.anchor;

      // Update selections
      setSelections((prev) =>
        prev.map((sel) => {
          if (
            Path.equals(sel.anchor.path, path) &&
            sel.anchor.offset >= offset
          ) {
            return {
              ...sel,
              anchor: {
                ...sel.anchor,
                offset: sel.anchor.offset + text.length,
              },
              focus: { ...sel.focus, offset: sel.focus.offset + text.length },
            };
          }
          return sel;
        })
      );

      // Update comment boxes
      setCommentBoxes((prev) =>
        prev.map((box) => {
          if (
            Path.equals(box.anchor.path, path) &&
            box.anchor.offset >= offset
          ) {
            return {
              ...box,
              anchor: {
                ...box.anchor,
                offset: box.anchor.offset + text.length,
              },
              focus: { ...box.focus, offset: box.focus.offset + text.length },
            };
          }
          return box;
        })
      );
    },
    [editor]
  );

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);

    setSelections(
      (prevSelections) =>
        prevSelections
          .map((selection) => {
            try {
              const normalizedSelection = Editor.range(editor, selection);
              return normalizedSelection;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as CustomRange[]
    );

    setCommentBoxes(
      (prevBoxes) =>
        prevBoxes
          .map((box) => {
            try {
              const normalizedBox = Editor.range(editor, box);
              return normalizedBox;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as CustomRange[]
    );
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Grid templateColumns="70% 30%" gap={4}>
        <GridItem>
          <Flex
            className="markdown-editor-container"
            direction="column"
            align="center"
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
          >
            <Box w="100%" onMouseUp={handleMouseUp} position="relative">
              <Slate
                editor={editor}
                initialValue={value}
                onChange={handleChange}
              >
                <Toolbar />
                <Editable
                  renderLeaf={renderLeaf}
                  decorate={decorate}
                  placeholder="Enter some text..."
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                />
              </Slate>
              {selections
                .filter((selection) => selection.color === "lightblue")
                .map((selection, index) => (
                  <PlusIcon
                    key={index}
                    selection={selection}
                    editor={editor}
                    onClick={() => addCommentBox(selection)}
                  />
                ))}
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Box position="relative" height="100%">
            {commentBoxes.map((box, index) => (
              <CommentBox key={index} selection={box} editor={editor} />
            ))}
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

const Toolbar: React.FC = () => {
  const editor = useSlate();
  return (
    <ButtonGroup mb={4}>
      <IconButton
        icon={<FiBold />}
        aria-label="Bold"
        onClick={() => toggleFormat(editor, "bold")}
      />
      <IconButton
        icon={<FiItalic />}
        aria-label="Italic"
        onClick={() => toggleFormat(editor, "italic")}
      />
      <IconButton
        icon={<FiUnderline />}
        aria-label="Underline"
        onClick={() => toggleFormat(editor, "underline")}
      />
    </ButtonGroup>
  );
};

const toggleFormat = (editor: ReactEditor, format: keyof CustomText) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor as BaseEditor & ReactEditor & HistoryEditor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: ReactEditor, format: keyof CustomText) => {
  const [match] = Editor.nodes(
    editor as BaseEditor & ReactEditor & HistoryEditor,
    {
      match: (n) => Text.isText(n) && n[format] === true,
      universal: true,
    }
  );

  return !!match;
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span
      {...attributes}
      style={{
        backgroundColor: leaf.highlight
          ? leaf.color || "#ffeeba"
          : "transparent",
      }}
    >
      {children}
    </span>
  );
};

const PlusIcon: React.FC<{
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

const CommentBox: React.FC<{ selection: CustomRange; editor: ReactEditor }> = ({
  selection,
  editor,
}) => {
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

import React, { useState, useCallback, useEffect } from "react";
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
import ReactDOM from "react-dom";
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
      setSelections([...selections, { ...selection, color: "lightblue" }]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      !event.target.closest(".comment-box")
    ) {
      setSelections((prevSelections) =>
        prevSelections.filter((sel) =>
          commentBoxes.some((box) => Range.equals(box, sel))
        )
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentBoxes]);

  const decorate = useCallback(
    ([node, path]: [Node, Path]) => {
      const ranges: any[] = [];
      if (Text.isText(node)) {
        selections.forEach((selection) => {
          const [start, end] = Range.edges(selection);
          const nodeRange = Editor.range(editor, path);

          if (
            Range.includes(nodeRange, start) ||
            Range.includes(nodeRange, end)
          ) {
            const anchorOffset = Path.equals(start.path, path)
              ? start.offset
              : 0;
            const focusOffset = Path.equals(end.path, path)
              ? end.offset
              : node.text.length;

            ranges.push({
              anchor: { path, offset: anchorOffset },
              focus: { path, offset: focusOffset },
              highlight: true,
              color: selection.color,
            });
          }
        });
      }
      return ranges;
    },
    [editor, selections]
  );

  const addCommentBox = (selection: CustomRange) => {
    setCommentBoxes([...commentBoxes, selection]);
    setSelections((prev) =>
      prev.map((sel) =>
        Range.equals(sel, selection) ? { ...sel, color: "yellow" } : sel
      )
    );
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Grid templateColumns="70% 30%" gap={4}>
        <GridItem>
          <Flex
            direction="column"
            align="center"
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
          >
            <Box w="100%" onMouseUp={handleMouseUp} position="relative">
              <Slate editor={editor} initialValue={value} onChange={setValue}>
                <Toolbar />
                <Editable
                  renderLeaf={renderLeaf}
                  decorate={decorate}
                  placeholder="Enter some text..."
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
  const domRange = ReactEditor.toDOMRange(editor, selection);
  const rect = domRange.getBoundingClientRect();

  return ReactDOM.createPortal(
    <IconButton
      style={{
        position: "absolute",
        top: `${rect.top + window.scrollY}px`, // Adjust this line if necessary
        left: "70%",
        transform: "translate(-50%, -40%)", // Changed from -100% to -50% for vertical alignment
      }}
      icon={<FiPlus />}
      aria-label="Add Comment"
      onClick={onClick}
    />,
    document.body
  );
};

const CommentBox: React.FC<{ selection: CustomRange; editor: ReactEditor }> = ({
  selection,
  editor,
}) => {
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
};

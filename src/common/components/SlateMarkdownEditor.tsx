import React, { useState, useCallback } from "react";
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
import { Box, Flex, IconButton, ButtonGroup } from "@chakra-ui/react";
import { FiBold, FiItalic, FiUnderline } from "react-icons/fi";

type CustomText = {
  text: string;
  highlight?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: BaseElement;
    Text: {
      text: string;
      highlight?: boolean;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
    };
  }
}

const initialValue: Descendant[] = [
  {
    children: [{ text: "Start typing..." }],
  },
];

type TSlateMarkdownEditorProps = {};

export const SlateMarkdownEditor: React.FC<TSlateMarkdownEditorProps> = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [selections, setSelections] = useState<Range[]>([]);

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const handleMouseUp = () => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      setSelections([...selections, selection]);
    }
  };

  const decorate = useCallback(
    ([node, path]: [Node, Path]) => {
      const ranges: any[] = [];
      if (Text.isText(node)) {
        selections.forEach((selection) => {
          //   const { anchor, focus } = selection;
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
            });
          }
        });
      }
      return ranges;
    },
    [editor, selections]
  );

  return (
    <Flex direction="column" align="center" p={4}>
      <Box w="80%" onMouseUp={handleMouseUp}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Toolbar />
          <Editable
            renderLeaf={renderLeaf}
            decorate={decorate}
            placeholder="Enter some text..."
          />
        </Slate>
      </Box>
    </Flex>
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
      style={{ backgroundColor: leaf.highlight ? "#ffeeba" : "transparent" }}
    >
      {children}
    </span>
  );
};

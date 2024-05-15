import React from "react";
import { Editor, BaseEditor, Text, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";
import { IconButton, ButtonGroup } from "@chakra-ui/react";
import { FiBold, FiItalic, FiUnderline } from "react-icons/fi";

export type CustomText = {
  text: string;
  highlight?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
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

export const Toolbar: React.FC = () => {
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

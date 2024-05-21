import { Transforms, Text, Editor } from "slate";

export const isFormatActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match: (n) => Text.isText(n) && (n as any)[format] === true,
    universal: true,
  });

  return !!match;
};

export const toggleFormat = (editor: Editor, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

import { Transforms, Text, Editor } from "slate";
import { CustomElement, CustomText } from "./SlateEditor";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root } from "mdast";

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

export const serialize = (nodes: CustomElement[]): string => {
  return nodes.map((node) => serializeNode(node)).join("\n");
};

export const serializeNode = (node: CustomElement | CustomText): string => {
  if (Text.isText(node)) {
    let text = node.text;
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `*${text}*`;
    if (node.underline) text = `__${text}__`;
    if (node.code) text = `\`${text}\``;
    if (node.comment) text = `<!--${node.comment}-${text}-->`;
    return text;
  }

  const children = node.children.map((n) => serializeNode(n)).join("");
  switch (node.type) {
    case "paragraph":
      return `${children}\n`;
    case "code":
      return `\`\`\`\n${children}\n\`\`\``;
    default:
      return children;
  }
};

export const deserialize = (markdown: string): CustomElement[] => {
  // Handle empty markdown
  if (!markdown.trim()) {
    return [
      {
        type: "paragraph",
        children: [{ text: markdown }],
      },
    ];
  }
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdown);
  return convertTreeToNodes(tree);
};

export const convertTreeToNodes = (tree: Root): CustomElement[] => {
  return tree.children.map(convertNodeToElement);
};

export const convertNodeToElement = (node: any): CustomElement => {
  switch (node.type) {
    case "paragraph":
      return {
        type: "paragraph",
        children: node.children.map(convertNodeToText),
      };
    case "code":
      return {
        type: "code",
        children: [{ text: node.value, code: true }],
      };
    default:
      return { type: "paragraph", children: [{ text: "" }] };
  }
};

const convertNodeToText = (node: any): CustomText => {
  const textNode: CustomText = { text: "" };
  if (node.type === "text" || node.type === "html") {
    textNode.text = node.value;
  } else if (node.type === "emphasis") {
    textNode.text = node.children[0].value;
    textNode.italic = true;
  } else if (node.type === "strong") {
    textNode.text = node.children[0].value;
    textNode.bold = true;
  } else if (node.type === "inlineCode") {
    textNode.text = node.value;
    textNode.code = true;
  }

  // Check for comment
  const commentMatch = textNode.text.match(/<!--([a-f0-9-]+)-(.*?)-->/);
  if (commentMatch) {
    textNode.comment = commentMatch[1]; // Selection id
    textNode.text = commentMatch[2]; // Comment
  }

  return textNode;
};

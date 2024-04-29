import React, { useState, useRef } from "react";
import { Box, Progress } from "@chakra-ui/react";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  markdownShortcutPlugin,
  imagePlugin,
  linkPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  listsPlugin,
  tablePlugin,
  headingsPlugin,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  Separator,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertAdmonition,
  InsertCodeBlock,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
} from "@mdxeditor/editor";

import { MarkdownErrorBoundry } from "common/components/MakdownErrorBoundry";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";
import { storeImage } from "notes/queries";

import "./MarkdownEditor.css";

type Props = {
  showToolbar?: boolean;
  markdown: string;
  onChange?: (markdown: string) => void;
  handlePasteCode?: (code: string) => void;
};

export const MarkdownEditor: React.FC<Props> = ({
  showToolbar = true,
  markdown,
  onChange,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const plugins = [
    listsPlugin(), // For ordered and unordered lists
    tablePlugin(), // For creating and editing tables
    markdownShortcutPlugin(), // Enables markdown shortcuts for quick formatting
    headingsPlugin(), // For creating and editing headings
    quotePlugin(), // For creating and editing blockquotes
    markdownShortcutPlugin(), // Enables markdown shortcuts for quick formatting
  ];

  if (showToolbar) {
    plugins.unshift(
      toolbarPlugin({
        toolbarContents: () => (
          <>
            {" "}
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <CodeToggle />
            <Separator />
            <ListsToggle />
            <Separator />
            <BlockTypeSelect />
            <Separator />
            <CreateLink />
            <InsertAdmonition />
            <InsertThematicBreak />
            <Separator />
            <InsertTable />
            <ConditionalContents
              options={[
                {
                  when: (editor: any) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          </>
        ),
      }), // For adding a toolbar to the editor
      imagePlugin({
        imageUploadHandler,
      }), // Allows for image insertion and manipulation
      linkPlugin(), // Enables adding and editing links
      codeBlockPlugin({
        defaultCodeBlockLanguage: "javascript",
      }), // For inserting and editing code blocks
      codeMirrorPlugin({
        codeBlockLanguages: {
          javascript: "javascript",
          js: "javascript",
          typescript: "typescript",
          ts: "typescript",
          css: "css",
          html: "html",
          go: "go",
          python: "python",
          java: "java",
          ruby: "ruby",
          yaml: "yaml",
          sh: "sh",
          text: "text",
        },
      })
    );
  }

  async function imageUploadHandler(image: File): Promise<string> {
    setUploadingImage(true);
    const { data: imageUrl } = await storeImage(image);
    setTimeout(() => {
      setUploadingImage(false);
    }, 750);
    return `https://cggpioxqwksvbbgnuyvc.supabase.co/storage/v1/object/public/note_images/${imageUrl?.path}`;
  }

  const handleReRender = () => {
    setRenderTrigger((prev) => prev + 1);
  };

  return (
    <Box className={!markdown ? "markdown-editor" : ""} key={renderTrigger}>
      {uploadingImage && <Progress mb="8px" hasStripe isIndeterminate />}

      <MarkdownErrorBoundry handleReRender={handleReRender}>
        <div ref={editorRef}>
          <MDXEditor
            className="markdown-editor"
            contentEditableClassName="prose"
            markdown={markdown}
            onChange={onChange}
            plugins={plugins}
          />
        </div>
      </MarkdownErrorBoundry>
    </Box>
  );
};

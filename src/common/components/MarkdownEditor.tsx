import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Progress,
  Popover,
  PopoverContent,
  PopoverBody,
  Text,
} from "@chakra-ui/react";
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
  enableAskGrowthy: boolean;
  showToolbar?: boolean;
  markdown: string;
  onChange?: (markdown: string) => void;
  setSelectedText?: (text: string) => void;
  handleAskGrowthy?: () => void;
  handlePasteCode?: (code: string) => void;
};

export const MarkdownEditor: React.FC<Props> = ({
  enableAskGrowthy = true,
  showToolbar = true,
  markdown,
  onChange,
  setSelectedText,
  handleAskGrowthy,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection();
      if (selection && selection?.rangeCount > 0 && editorRef.current) {
        let range = selection.getRangeAt(0);
        let commonAncestorContainer: Node = range.commonAncestorContainer;

        // Adjust commonAncestorContainer to be an Element if it's not
        if (commonAncestorContainer.nodeType !== Node.ELEMENT_NODE) {
          // Ensure we only assign it if parentNode is not null
          if (commonAncestorContainer.parentNode !== null) {
            commonAncestorContainer = commonAncestorContainer.parentNode;
          }
        }

        const isSelectionWithinEditor = editorRef.current.contains(
          commonAncestorContainer as Node
        );

        // Assuming you have a way to determine if it's a code block
        // For example, by checking if any parent node is a 'code' element
        const isWithinCodeBlock = (commonAncestorContainer as Element).closest(
          ".cm-editor"
        );

        // Check if the selection is within a header
        const isWithinHeader = (commonAncestorContainer as Element).closest(
          "h1, h2, h3, h4, h5, h6"
        );

        if (!isSelectionWithinEditor || isWithinCodeBlock || isWithinHeader) {
          return;
        }

        const rect = range.getBoundingClientRect();
        const selectedText = range.toString();

        if (rect.width > 0) {
          setIsOpen(true);
          setPopoverPos({
            top: rect.top + window.scrollY - 40,
            left: rect.left + window.scrollX + rect.width / 2,
          });

          if (setSelectedText) {
            setSelectedText(selectedText);
          }
        } else {
          setIsOpen(false);
        }
      } else {
        if (setSelectedText) {
          setSelectedText("");
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

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
      {isOpen && enableAskGrowthy && (
        <Popover
          isOpen={isOpen}
          closeOnBlur={true}
          placement="top"
          initialFocusRef={editorRef}
        >
          <PopoverContent
            style={{
              position: "absolute",
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              width: "150px",
            }}
          >
            <PopoverBody>
              <Box
                as="button" // Using Box as a button for semantic HTML, but styled as Flex
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: "gray.100" }} // Add hover effect similar to a button
                _active={{ bg: "gray.200" }} // Add active (click) effect
                onClick={handleAskGrowthy} // Add your click handler here
              >
                <GrowthyOval />
                <Text ml="8px">Ask Growthy</Text>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
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

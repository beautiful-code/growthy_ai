import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Box, Flex, Button } from "@chakra-ui/react";

type MarkdownRendererProps = {
  children: string;
  handlePasteCode?: (code: string) => void;
};

export function MarkdownRenderer({
  children: markdown,
  handlePasteCode,
}: MarkdownRendererProps) {
  const preprocessedMarkdown = markdown.replace(
    /^```markdown\n([\s\S]*)/,
    "$1"
  );

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <Box>
              <Flex justify={"flex-end"}>
                <Button
                  ml="8px"
                  size={"xs"}
                  onClick={() => {
                    navigator.clipboard.writeText(String(children));
                    if (handlePasteCode) {
                      handlePasteCode(String(children));
                    }
                  }}
                >
                  Insert Code
                </Button>
              </Flex>
              <SyntaxHighlighter
                style={dracula}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </Box>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {preprocessedMarkdown}
    </Markdown>
  );
}

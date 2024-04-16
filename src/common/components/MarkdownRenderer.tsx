import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Box, Flex, Text } from "@chakra-ui/react";
import { GButton } from "common/components/GButton";

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
        h1: ({ children, ...props }) => <Text as="h1" fontSize="2xl" fontWeight={"bold"} {...props}>{children}</Text>,        
        h2: ({ children, ...props }) => <Text as="h2" fontSize="large" {...props}>{children}</Text>,        
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <Box>
              <Flex justify={"flex-end"}>
                <GButton
                  type="secondary"
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
                </GButton>
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

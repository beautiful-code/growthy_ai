import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Flex, Textarea } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

import { MarkdownRenderer } from "common/components/MarkdownRenderer";
// import { getGuidance } from "growth-exercise/chains/getIdeasChain";

// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";

const MessageHeader: React.FC<{ item: { type: string; text: string } }> = ({
  item,
}) => {
  return (
    <Flex>
      {item.type === "chatbot" ? <GrowthyOval /> : <span />}
      <Text ml="4px" fontWeight={"bold"}>
        {item.type === "chatbot" ? "Growthy" : "You"}
      </Text>
    </Flex>
  );
};

const Message: React.FC<{ item: TConvo }> = ({ item }) => {
  return (
    <Box mt="8px">
      {item.text && <MessageHeader item={item} />}
      <MarkdownRenderer>{item.text}</MarkdownRenderer>
    </Box>
  );
};

type TConvo = {
  type: string;
  text: string;
};

type Props = {
  blogTitle: string;
  blogPoints: string[];
  isAdditionalPrompt: boolean;
  onClose: () => void;
  getGuidance: any;
};

export const GrowthyConversation: React.FC<Props> = ({
  blogTitle,
  blogPoints,
  isAdditionalPrompt,
  onClose,
  getGuidance,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef("");
  const [result, setResult] = useState("");

  const [newContent, setNewContent] = useState("");
  const [conversation, setConversation] = useState<TConvo[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    console.log(1);
    handleRespond("", true);
  }, []);

  const resultRefCurrent = resultRef.current;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation, result, resultRefCurrent]);

  const handleRespond = async (content: string, isInitialPrompt = false) => {
    const updatedConversation = [
      ...conversation,
      { type: "user", text: content },
    ];

    setConversation(updatedConversation);

    const stream = await getGuidance({
      blog_article_goal: blogTitle,
      blog_article_points: blogPoints,
      context: content,
      isAdditionalPrompt,
      isInitialPrompt,
      conversation: updatedConversation,
    });
    setNewContent("");
    let chatbotResponse = "";
    for await (const chunk of stream) {
      resultRef.current = resultRef.current + chunk;
      chatbotResponse = chatbotResponse + chunk;
      setResult((rst) => rst + chunk);
    }

    setConversation((conv) => [
      ...conv,
      {
        type: "chatbot",
        text: chatbotResponse,
      },
    ]);

    resultRef.current = "";
    setResult("");
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      handleRespond(newContent);
    }
  };

  return (
    <Box
      p="8px"
      height={"100vh"} // This sets the height of the entire container
      // height={"100vh"} // This sets the height of the entire container
      display="flex"
      flexDirection="column"
      justifyContent="space-between" // Ensures the input is pushed to the bottom
      backgroundColor={"#F0FAF0B2"}
    >
      <Flex justify={"end"}>
        <Box style={{ cursor: "pointer" }}>
          <MdClose onClick={onClose} />
        </Box>
      </Flex>
      <Box overflowY="auto" overflowX="hidden" flex="1">
        <Box ml="20px">
          <Box>
            {conversation.map((item) => {
              return <Message item={item} />;
            })}
          </Box>
          {result && (
            <Box mt="8px">
              <MessageHeader item={{ type: "chatbot", text: "" }} />
              <MarkdownRenderer>{result}</MarkdownRenderer>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      <Box mt="8px">
        <MessageHeader item={{ type: "user", text: "I am thinking..." }} />
        <Textarea
          ref={inputRef}
          ml={1}
          minH="unset"
          overflow="hidden"
          w="100%"
          resize="none"
          minRows={1}
          py={0}
          as={ResizeTextarea}
          className="deepee-text-area"
          fontSize={"medium"}
          placeholder="I am thinking..."
          value={newContent}
          onChange={(event) => {
            setNewContent(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Box>
  );
};

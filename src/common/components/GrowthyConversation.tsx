import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Flex, Textarea } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

import { useGetConversation } from "common/hooks/useGetConversation";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
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
  type: string; // make this chatbot | user
  text: string; // make this markdowmnText
};

type Props = {
  height?: string;
  inputs: any;
  askGrowthySelectedText?: any;
  onCloseCallback: () => void;
  getConversation: any;
};

export const GrowthyConversation: React.FC<Props> = ({
  height = "100vh",
  inputs,
  getConversation,
  onCloseCallback,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<TConvo[]>([]);

  const { refetch } = useGetConversation({
    inputs,
    context: "",
    isInitialPrompt: true,
    conversation: [],
    getConversation,
    onGetChunk: (chunk) => {
      setConversation((currentConvo) => {
        if (currentConvo.length === 0)
          return (currentConvo = [{ type: "chatbot", text: chunk }]);

        const lastConvo = currentConvo[currentConvo.length - 1];

        if (lastConvo && lastConvo.type === "chatbot") {
          return [
            ...currentConvo.slice(0, currentConvo.length - 1),
            { type: "chatbot", text: lastConvo.text + chunk },
          ];
        } else {
          return [...currentConvo, { type: "chatbot", text: chunk }];
        }
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const updatedConversation = [
        ...conversation,
        { type: "user", text: userInput },
      ];

      setConversation(updatedConversation);

      setUserInput("");

      refetch({
        ...inputs,
        context: userInput,
        isInitialPrompt: true,
        conversation: updatedConversation,
      });
    }
  };

  return (
    <Box
      p="8px"
      height={height}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      backgroundColor={"#F0FAF0B2"}
    >
      <Flex justify={"end"}>
        <Box style={{ cursor: "pointer" }}>
          <MdClose onClick={onCloseCallback} />
        </Box>
      </Flex>

      <Box overflowY="auto" overflowX="hidden" flex="1">
        <Box ml="20px">
          <Box>
            {conversation.map((item) => {
              return <Message item={item} />;
            })}
          </Box>

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
          value={userInput}
          onChange={(event) => {
            setUserInput(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Box>
  );
};

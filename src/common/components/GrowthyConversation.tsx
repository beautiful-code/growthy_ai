import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Text, Flex, Textarea } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import ResizeTextarea from "react-textarea-autosize";

import {
  useGetPersistedConversations,
  useGetConversation,
  usePersistConversation,
} from "common/hooks";
import {
  getPersistedConversations as defaultGetPersistedConversations,
  persistConversation as defaultPersistConversation,
} from "common/queries";
import { TConvo } from "types";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";

const MessageHeader: React.FC<{ item: TConvo }> = ({ item }) => {
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
      {item.markdownText && <MessageHeader item={item} />}
      <MarkdownRenderer>{item.markdownText}</MarkdownRenderer>
    </Box>
  );
};

export type Props = {
  height?: string;
  inputs: any;
  resourceId: string;
  askGrowthySelectedText?: any;
  onCloseCallback: () => void;
  getConversation: any;
  getPersistedConversations?: any;
  persistConversation?: any;
};

export const GrowthyConversation: React.FC<Props> = ({
  height = "100vh",
  inputs,
  resourceId,
  getConversation,
  getPersistedConversations = defaultGetPersistedConversations,
  persistConversation = defaultPersistConversation,
  onCloseCallback,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<TConvo[]>([]);
  const [enabled, setEnabled] = useState(false);

  const { persistedConversations, isLoading } = useGetPersistedConversations(
    resourceId,
    getPersistedConversations
  );

  const { persistConversationMutation } =
    usePersistConversation(persistConversation);

  useEffect(() => {
    if (!isLoading) {
      if (persistedConversations.length > 0) {
        setConversation(persistedConversations as TConvo[]);
      }
      setEnabled(true);
    }
  }, [isLoading]);

  useGetConversation({
    enabled: enabled,
    latestConvoMsg:
      !conversation || conversation.length === 0
        ? null
        : conversation[conversation.length - 1],
    isInitialPrompt: true,
    conversation,
    getConversation: (
      context: string,
      isInitialPrompt: boolean,
      conversation: TConvo[]
    ) => getConversation(inputs, context, isInitialPrompt, conversation),
    onGetChunk: (chunk) => {
      setConversation((currentConvo) => {
        if (currentConvo.length === 0)
          return (currentConvo = [{ type: "chatbot", markdownText: chunk }]);

        const lastConvo = currentConvo[currentConvo.length - 1];

        if (lastConvo && lastConvo.type === "chatbot") {
          return [
            ...currentConvo.slice(0, currentConvo.length - 1),
            { type: "chatbot", markdownText: lastConvo.markdownText + chunk },
          ];
        } else {
          return [...currentConvo, { type: "chatbot", markdownText: chunk }];
        }
      });
    },
    onConversationEnd: (data) => {
      if (data) {
        persistConversationMutation({
          id: uuidv4(),
          resourceId,
          type: "chatbot",
          markdownText: data,
          resourceType: "execute",
        });
      }
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const updatedConversation: TConvo[] = [
        ...conversation,
        { type: "user", markdownText: userInput },
      ];

      setConversation(updatedConversation);

      persistConversationMutation({
        id: uuidv4(),
        resourceId,
        type: "user",
        markdownText: userInput,
        resourceType: "execute",
      });

      setUserInput("");
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
        <MessageHeader
          item={{ type: "user", markdownText: "I am thinking..." }}
        />
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

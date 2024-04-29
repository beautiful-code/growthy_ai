import { useState, useEffect } from "react";
import { TConvo } from "types";

type TUseGetConversation = {
  latestConvoMsg: TConvo | null;
  isInitialPrompt: boolean;
  enabled: boolean;
  conversation: { type: string; text: string }[];
  getConversation: any;
  onGetChunk?: (chunk: string) => void;
  onConversationEnd?: (receivedMarkdownText: string) => void;
};

type TUseGetConversationResponse = {
  data: string;
  error: Error | null;
  isGettingChunks: boolean;
};

export const useGetConversation = ({
  latestConvoMsg,
  isInitialPrompt,
  enabled,
  conversation,
  getConversation,
  onGetChunk,
  onConversationEnd,
}: TUseGetConversation): TUseGetConversationResponse => {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [isGettingChunks, setIsGettingChunks] = useState(true);

  const latestConvoMsgType = latestConvoMsg?.type;

  useEffect(() => {
    console.log({ enabled, latestConvoMsgType });
    if (!enabled || latestConvoMsgType === "chatbot") return;

    // Only if the latesConvoMsg?.type is user or if the convo is emoty, we will start fetching the conversation
    setIsGettingChunks(true);

    const fetchData = async () => {
      try {
        const stream = await getConversation(
          latestConvoMsg?.markdownText,
          isInitialPrompt,
          conversation
        );
        let resp = "";
        for await (const chunk of stream) {
          setData(data + chunk);
          resp += chunk;
          onGetChunk && onGetChunk(chunk);
        }
        onConversationEnd && onConversationEnd(resp);
      } catch (err) {
        if (isGettingChunks) {
          setError(err as Error);
        }
      }
    };

    fetchData();

    return () => {
      setIsGettingChunks(false);
    };
  }, [enabled, latestConvoMsgType]);

  return {
    isGettingChunks,
    data,
    error,
  };
};

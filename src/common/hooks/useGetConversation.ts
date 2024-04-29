import { useState, useEffect } from "react";

type TUseGetConversation = {
  inputs: any;
  context: string;
  isInitialPrompt: boolean;
  conversation: { type: string; text: string }[];
  getConversation: any;
  enabled?: boolean;
  onGetChunk?: (chunk: string) => void;
};

type TUseGetConversationResponse = {
  data: string;
  error: Error | null;
  isActive: boolean;
  refetch: (context: string) => void;
};

export const useGetConversation = ({
  inputs,
  context: defaultContext, // last item in conversation, latestConvoMsg
  isInitialPrompt,
  conversation,
  getConversation, // if we are getting this as input why do we need inputs
  enabled = true,
  onGetChunk,
}: TUseGetConversation): TUseGetConversationResponse => {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [isActive, setIsActive] = useState(true); // isGettingChunks
  const [context, setContext] = useState<string>(defaultContext);

  useEffect(() => {
    if (!enabled) return;
    setIsActive(true);

    const fetchData = async () => {
      try {
        const stream = await getConversation(
          inputs,
          context,
          isInitialPrompt,
          conversation
        );
        for await (const chunk of stream) {
          if (isActive) {
            setData(data + chunk);
            onGetChunk && onGetChunk(chunk);
          }
        }
      } catch (err) {
        if (isActive) {
          setError(err as Error);
        }
      }
    };

    fetchData();

    return () => {
      setIsActive(false);
    };
  }, [enabled, context]);

  const refetch = (context: string) => {
    setContext(context);
    setData("");
    setError(null);
  };

  return {
    isActive,
    data,
    error,
    refetch,
  };
};

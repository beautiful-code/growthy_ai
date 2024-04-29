import { ChatOpenAI } from "@langchain/openai";

import { Client } from "langsmith";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

const getOpenAICallbacks = () => {
  const callbacks: LangChainTracer[] = [
    new LangChainTracer({
      projectName: import.meta.env.VITE_LANGCHAIN_PROJECT,
      client: new Client({
        apiUrl: "https://api.smith.langchain.com",
        apiKey: import.meta.env.VITE_LANGCHAIN_API_KEY,
      }),
    }),
  ];

  return callbacks;
};

export const openAIModel = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  modelName: "gpt-4-turbo-preview",
  callbacks: getOpenAICallbacks(),
});

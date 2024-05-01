import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import getGrowthyConfig from "growthy-prompts";
import { openAIModel } from "openAIClient";
import { TConvo } from "types";

export const getAnswerGenerationChainPrompt = (prompt: string) =>
  ChatPromptTemplate.fromMessages([
    ["system", prompt],
    new MessagesPlaceholder("history"),
  ]);

const parser = new StringOutputParser();

const getConversationalRetrievalChain = (prompt: string) =>
  RunnableSequence.from([
    getAnswerGenerationChainPrompt(prompt),
    openAIModel,
    parser,
  ]);

export const getGuidance = async (
  inputs: {
    blog_article_goal: string;
    blog_article_xml: string;
    blog_article_task: string;
  },
  context = "",
  isInitialPrompt = false,
  conversation: TConvo[] = []
) => {
  const config = getGrowthyConfig();
  const getGuidanceForTaskExecutionPrompt =
    config?.blog_article?.get_guidance_for_task_execution_no_notes?.prompt;

  const askGrowthyForSelectionPrompt =
    config?.blog_article?.ask_growthy_for_selection?.prompt;

  const conversationPrompt = getConversationalRetrievalChain(
    isInitialPrompt
      ? getGuidanceForTaskExecutionPrompt
      : askGrowthyForSelectionPrompt
  );

  const response = await conversationPrompt.stream({
    specialization: "",
    ...inputs,
    ask_growthy_selection: context,
    context,
    format_instructions: parser.getFormatInstructions(),
    history: conversation.map((message) => {
      if (message.type === "user") {
        return new HumanMessage(message.markdownText);
      } else {
        return new AIMessage(message.markdownText);
      }
    }),
  });

  return (async function* () {
    for await (const chunk of response) {
      yield chunk;
    }
  })();
};

import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import getGrowthyConfig from "growthy-prompts";

export const getAnswerGenerationChainPrompt = (prompt: string) =>
  ChatPromptTemplate.fromMessages([
    ["system", prompt],
    new MessagesPlaceholder("history"),
  ]);

const model = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  modelName: "gpt-4-turbo-preview",
});

const parser = new StringOutputParser();

const getConversationalRetrievalChain = (prompt: string) =>
  RunnableSequence.from([
    getAnswerGenerationChainPrompt(prompt),
    model,
    parser,
  ]);

export const getFormattedPrompt = async ({
  specialization,
  blog_article_goal,
  blog_article_points,
  context,
  conversation,
  isAdditionalPrompt = false,
  isInitialPrompt = false,
}: {
  specialization: string;
  blog_article_goal: string;
  blog_article_points: string[];
  context: string;
  isAdditionalPrompt: boolean;
  isInitialPrompt: boolean;
  conversation: { type: string; text: string }[];
}) => {
  const config = getGrowthyConfig();

  const suggestedPointsPrompt =
    config?.blog_article?.suggest_points_for_goal?.prompt;
  const suggestedPointsConvoPrompt = `Given this context and histroy, please respond to the user {context}`;
  const suggestAdditionalPointsPrompt =
    config?.blog_article?.suggest_additional_points_for_goal?.prompt;
  const suggestAdditionalPointsConvoPrompt = `Given this context and histroy, please respond to the user {context}`;

  const conversationPrompt = getAnswerGenerationChainPrompt(
    isInitialPrompt
      ? isAdditionalPrompt
        ? suggestAdditionalPointsPrompt
        : suggestedPointsPrompt
      : isAdditionalPrompt
      ? suggestAdditionalPointsConvoPrompt
      : suggestedPointsConvoPrompt
  );

  const prompt = await conversationPrompt.format({
    specialization,
    blog_article_goal,
    currentPoints: JSON.stringify(blog_article_points),
    context,
    format_instructions: parser.getFormatInstructions(),
    history: conversation.map((message) => {
      if (message.type === "user") {
        return new HumanMessage(message.text);
      } else {
        return new AIMessage(message.text);
      }
    }),
  });

  return prompt;
};

export const getGuidance = async (
  specialization = "",
  blog_article_goal = "",
  blog_article_points: string[] = [],
  context = "",
  isAdditionalPrompt = false,
  isInitialPrompt = false,
  conversation: { type: string; text: string }[] = []
) => {
  const config = getGrowthyConfig();
  const suggestedPointsPrompt =
    config?.blog_article?.suggest_points_for_goal?.prompt;
  const suggestedPointsConvoPrompt = `Given this context and histroy, please respond to the user {context}`;
  const suggestAdditionalPointsPrompt =
    config?.blog_article?.suggest_additional_points_for_goal?.prompt;
  const suggestAdditionalPointsConvoPrompt = `Given this context and histroy, please respond to the user {context}`;

  const conversationPrompt = getConversationalRetrievalChain(
    isInitialPrompt
      ? isAdditionalPrompt
        ? suggestAdditionalPointsPrompt
        : suggestedPointsPrompt
      : isAdditionalPrompt
      ? suggestAdditionalPointsConvoPrompt
      : suggestedPointsConvoPrompt
  );
  const response = await conversationPrompt.stream({
    specialization,
    blog_article_goal,
    current_points: JSON.stringify(blog_article_points),
    context,
    format_instructions: parser.getFormatInstructions(),
    history: conversation.map((message) => {
      if (message.type === "user") {
        return new HumanMessage(message.text);
      } else {
        return new AIMessage(message.text);
      }
    }),
  });

  return (async function* () {
    for await (const chunk of response) {
      yield chunk;
    }
  })();
};

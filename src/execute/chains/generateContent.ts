import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import getGrowthyConfig from "growthy-prompts";

const model = new OpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-4-turbo-preview",
});

const parser = new StringOutputParser();

type TGetContent = {
  blog_article_goal: string;
  blog_article_xml: string;
};

export const getContent = async ({
  blog_article_goal,
  blog_article_xml,
}: TGetContent) => {
  const config = getGrowthyConfig();
  const generateContentPrompt = config?.blog_article?.generate_content?.prompt;
  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(generateContentPrompt),
    model,
    parser,
  ]);

  const response = await chain.invoke({
    specialization: "", // Ravi - is specialization still needed?
    blog_article_goal,
    blog_article_xml,
    format_instructions: parser.getFormatInstructions(),
  });

  return response;
};

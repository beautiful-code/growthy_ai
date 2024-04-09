// import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
// import { StructuredOutputParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import getGrowthyConfig from "growthy-prompts";

const model = new OpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-4-turbo-preview",
});

const parser = new StringOutputParser();

export const getBlogArticleXMLSuggestion = async (
  specialization = "",
  blog_article_goal = "",
  blog_article_points: string[] = []
) => {
  const config = getGrowthyConfig();
  const generateOutlineContentPrompt =
    config?.blog_article?.generate_outline?.prompt;

  const prompt = PromptTemplate.fromTemplate(generateOutlineContentPrompt);

  const chain = RunnableSequence.from([prompt, model, parser]);

  const response = await chain.invoke({
    specialization,
    blog_article_goal,
    blog_article_points: blog_article_points.join("\n"),
  });

  return response;
};

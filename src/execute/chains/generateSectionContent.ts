import { PromptTemplate } from "@langchain/core/prompts";
import { openAIModel } from "openAIClient";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import getGrowthyConfig from "growthy-prompts";

const parser = new StringOutputParser();

type TGenerateSectionContent = {
  blog_article_xml: string;
  blog_article_title: string;
  blog_article_task: string;
  blog_article_task_notes: string;
};

export const generateSectionsContent = async ({
  blog_article_xml,
  blog_article_title,
  blog_article_task,
  blog_article_task_notes,
}: TGenerateSectionContent): Promise<string> => {
  const config = getGrowthyConfig();
  const generateContentPrompt =
    config?.blog_article?.generate_content_for_task?.prompt;
  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(generateContentPrompt),
    openAIModel,
    parser,
  ]);

  const response = await chain.invoke({
    specialization: "", // Ravi - is specialization still needed?
    blog_article_goal: blog_article_title,
    blog_article_xml,
    blog_article_task,
    blog_article_task_notes,
    format_instructions: parser.getFormatInstructions(),
  });

  console.log({ response });

  return response;
};

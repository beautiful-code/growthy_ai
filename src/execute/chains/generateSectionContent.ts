import { PromptTemplate } from "@langchain/core/prompts";
import { openAIModel } from "openAIClient";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import getGrowthyConfig from "growthy-prompts";

import { PreviewSection } from "types";

const parser = new StringOutputParser();

type TGenerateSectionContent = {
  blog_article_goal: string;
  blog_article_xml: string;
  sections: PreviewSection[];
};

export const generateSectionsContent = async ({
  blog_article_goal,
  blog_article_xml,
  sections,
}: TGenerateSectionContent) => {
  const config = getGrowthyConfig();
  const generateContentPrompt = config?.blog_article?.generate_content?.prompt;
  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(generateContentPrompt),
    openAIModel,
    parser,
  ]);

  const response = await chain.invoke({
    specialization: "", // Ravi - is specialization still needed?
    blog_article_goal,
    blog_article_xml,
    selectedSections: sections.map((section) => section.title).join(",\n"),
    format_instructions: parser.getFormatInstructions(),
  });

  return response?.split(",") || [];
};

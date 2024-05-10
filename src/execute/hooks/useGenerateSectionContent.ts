import { useQuery } from "@tanstack/react-query";

import { PreviewSection } from "types";
import { getXMLStringFromMarkdown } from "growth-exercise/chains/utils";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";

type TUseGenerateContentResp = {
  sections: PreviewSection[];
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

type TUseGenerateContentArgs = {
  enabled?: boolean;
  blog_article_goal: string;
  blog_article_xml: string;
  sections: PreviewSection[];
  generateSectionsContent: ({
    blog_article_goal,
    blog_article_xml,
    sections,
  }: {
    blog_article_goal: string;
    blog_article_xml: string;
    sections: PreviewSection[];
  }) => Promise<string[]>;
};

export const useGenerateSectionsContent = ({
  enabled = false,
  blog_article_goal = "",
  blog_article_xml = "",
  sections,
  generateSectionsContent = defaultGenerateSectionsContent,
}: TUseGenerateContentArgs): TUseGenerateContentResp => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["generate-sections-conent"],
    queryFn: () =>
      generateSectionsContent({
        blog_article_goal,
        blog_article_xml,
        sections,
      }),
    enabled,
  });

  if (error) {
    console.log(error);
  }

  let index = 0;
  const uiSections = sections.map((section) => {
    const tasks = section.tasks;

    const tasksWithContent = tasks.map((task) => {
      index += 1;
      return {
        title: task.title,
        id: task.id,
        content: data ? getXMLStringFromMarkdown(data[index - 1]) : "",
        isChecked: task.isChecked,
      };
    });

    return {
      title: section.title,
      tasks: tasksWithContent,
    };
  });

  return {
    sections: uiSections,
    isLoading,
    isFetching,
    refetch,
  };
};

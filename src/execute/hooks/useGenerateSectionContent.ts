import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getXMLStringFromMarkdown } from "growth-exercise/chains/utils";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";

type TUseGenerateContentResp = {
  content: string[];
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

type TUseGenerateContentArgs = {
  enabled?: boolean;
  blog_article_title: string;
  blog_article_xml: string;
  blog_article_tasks: string[];
  blog_article_tasks_notes: string[];
  generateSectionsContent: ({
    blog_article_task,
    blog_article_xml,
    blog_article_title,
    blog_article_task_notes,
  }: {
    blog_article_title: string;
    blog_article_xml: string;
    blog_article_task: string;
    blog_article_task_notes: string;
  }) => Promise<string>;
};

export const useGenerateSectionsContent = ({
  enabled = false,
  blog_article_title = "",
  blog_article_xml = "",
  blog_article_tasks = [],
  blog_article_tasks_notes = [],
  generateSectionsContent = defaultGenerateSectionsContent,
}: TUseGenerateContentArgs): TUseGenerateContentResp => {
  const [generatedSectionsData, setGeneratedSectionsData] = useState<string[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["generate-sections-conent"],
    queryFn: () =>
      generateSectionsContent({
        blog_article_title,
        blog_article_xml,
        blog_article_task: blog_article_tasks[currentIndex],
        blog_article_task_notes: blog_article_tasks_notes[currentIndex],
      }),
    enabled,
  });

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    console.log("in use effect");
    if (data && !isLoading && currentIndex < blog_article_tasks.length) {
      console.log("data", data);
      setGeneratedSectionsData([
        ...generatedSectionsData,
        data ? getXMLStringFromMarkdown(data) : "null",
      ]);
      setCurrentIndex(currentIndex + 1);
      refetch();
    }
  }, [
    isLoading,
    data,
    currentIndex,
    blog_article_tasks.length,
    refetch,
    generatedSectionsData,
  ]);

  return {
    content: generatedSectionsData,
    isLoading,
    isFetching,
    refetch,
  };
};

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

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
  const generatedSectionsDataRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["generate-sections-conent"],
    queryFn: () =>
      generateSectionsContent({
        blog_article_title,
        blog_article_xml,
        blog_article_task: blog_article_tasks[currentIndexRef.current],
        blog_article_task_notes:
          blog_article_tasks_notes[currentIndexRef.current],
      }),
    enabled,
  });

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (
      data &&
      !isLoading &&
      currentIndexRef.current < blog_article_tasks.length - 1
    ) {
      // generatedSectionsDataRef.current.push(data ? getXMLStringFromMarkdown(data) : "");
      generatedSectionsDataRef.current.push(data || "");
      currentIndexRef.current = currentIndexRef.current + 1;
      refetch();
    }
  }, [
    isLoading,
    data,
    currentIndexRef,
    blog_article_tasks.length,
    refetch,
    generatedSectionsDataRef,
  ]);

  return {
    content: generatedSectionsDataRef.current,
    isLoading,
    isFetching,
    refetch,
  };
};

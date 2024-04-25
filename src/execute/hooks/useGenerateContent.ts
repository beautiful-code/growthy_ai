import { useQuery } from "@tanstack/react-query";

import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { getXMLStringFromMarkdown } from "growth-exercise/chains/utils";

type TUseGenerateContentResp = {
  uiBlogArticle: UIBlogArticle | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

type TUseGenerateContentArgs = {
  enabled?: boolean;
  blog_article_goal: string;
  blog_article_xml: string;
  generateContent: ({
    blog_article_goal,
    blog_article_xml,
  }: {
    blog_article_goal: string;
    blog_article_xml: string;
  }) => Promise<string>;
};

export const useGenerateContent = ({
  enabled = false,
  blog_article_goal = "",
  blog_article_xml = "",
  generateContent,
}: TUseGenerateContentArgs): TUseGenerateContentResp => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["generate-conent"],
    queryFn: () =>
      generateContent({
        blog_article_goal,
        blog_article_xml,
      }),
    enabled,
  });

  if (error) {
    console.log(error);
  }

  console.log({ data });

  return {
    uiBlogArticle: data
      ? new UIBlogArticle(getXMLStringFromMarkdown(data))
      : null,
    isLoading,
    isFetching,
    refetch,
  };
};

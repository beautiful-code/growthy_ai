import { useQuery } from "@tanstack/react-query";

import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { getContent as defaultGetContent } from "execute/chains/generateContent";
import { getXMLStringFromMarkdown } from "growth-exercise/chains/utils";

type TUseGenerateContent = {
  uiBlogArticle: UIBlogArticle | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

export const useGenerateContent = ({
  enabled = false,
  blog_article_goal = "",
  exercise = "",
  blog_article_xml = "",
  generateContent = defaultGetContent,
}): TUseGenerateContent => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["generate-conent"],
    queryFn: () =>
      generateContent({
        exercise,
        blog_article_goal,
        blog_article_xml,
      }),
    enabled,
  });

  if (error) {
    console.log(error);
  }
  return {
    uiBlogArticle: data
      ? new UIBlogArticle(getXMLStringFromMarkdown(data))
      : null,
    isLoading,
    isFetching,
    refetch,
  };
};

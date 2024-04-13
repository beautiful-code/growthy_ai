import React from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { GButton } from "common/components/GButton";

import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { Outline } from "common/components/outline/Outline";
import { UIOutline } from "domain/common/UIOutline";

type Props = {
  isAddingBlogArticle?: boolean;
  blogArticle: UIBlogArticle;
  onBlogArticleUpdate: (blogArticle: UIBlogArticle) => void;
  handleAddBlogArticle: () => void;
};

export const BlogArticle: React.FC<Props> = ({
  isAddingBlogArticle = false,
  blogArticle,
  onBlogArticleUpdate,
  handleAddBlogArticle,
}) => {
  const handleUpdateOutline = (uiOutline: UIOutline) => {
    blogArticle.updateOutline(uiOutline);
    onBlogArticleUpdate(blogArticle);
  };

  return (
    <Box>
      <Text display={"block"}>{blogArticle.getTitle()}</Text>
      <Outline
        uiOutline={blogArticle.getOutline()}
        onUpdateOutlineCallback={handleUpdateOutline}
      />
      <GButton type="primary" onClick={handleAddBlogArticle}>
        Add Blog Article
        {isAddingBlogArticle && <Spinner size="sm" />}
      </GButton>
    </Box>
  );
};

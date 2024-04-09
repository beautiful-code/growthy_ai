import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";

import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { Outline } from "common/components/outline/Outline";
import { UIOutline } from "domain/blog-article/UIOutline";

type Props = {
  blogArticle: UIBlogArticle;
  onBlogArticleUpdate: (blogArticle: UIBlogArticle) => void;
  handleAddBlogArticle: () => void;
};

export const BlogArticle: React.FC<Props> = ({
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
      <Button colorScheme="green" onClick={handleAddBlogArticle}>
        Add Blog Article
      </Button>
    </Box>
  );
};

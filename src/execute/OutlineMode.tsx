import { Flex, Box } from "@chakra-ui/react";
import { Outline } from "common/components/outline/Outline";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UIOutline } from "domain/common/UIOutline";
import React from "react";

type Props = {
  exerciseXML: string;
  growthExerciseId: string | undefined;
  handleOutlineUpdate: (uiOutline: UIOutline) => void;
};

export const OutlineMode: React.FC<Props> = ({
  exerciseXML,
  handleOutlineUpdate,
}) => {
  const blogArticle = new UIBlogArticle(exerciseXML || "");

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
      my={"70px"}
    >
      <Box width="50%" ml={"20%"}>
        <Outline
          uiOutline={blogArticle.getOutline()}
          allowOutlineChanges
          onUpdateOutlineCallback={handleOutlineUpdate}
          alwaysExpand
          checkingEnabled
          allowExpand={false}
        />
      </Box>
    </Flex>
  );
};

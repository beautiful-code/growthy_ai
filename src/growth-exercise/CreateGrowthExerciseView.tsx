import React from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { CreateStudyExerciseView } from "growth-exercise/components/study-exercise/CreateStudyExerciseView";
import { CreateBlogArticleView } from "growth-exercise/components/blog-article/CreateBlogArticleView";

type Props = {};

export const CreateGrowthExerciseView: React.FC<Props> = () => {
  const { type } = useParams();

  return (
    <Box>
      {type === "study" && <CreateStudyExerciseView />}

      {type === "blog-article" && <CreateBlogArticleView />}
    </Box>
  );
};

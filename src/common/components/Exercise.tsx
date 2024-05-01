import React from "react";
import { useNavigate } from "react-router-dom";
import { TExercise } from "types";
import { MdEdit } from "react-icons/md";
// @ts-expect-error: Svg import
import StudyExerciseIcon from "assets/StudyExerciseIcon.svg?react";
// @ts-expect-error: Svg import
import BlogArticleIcon from "assets/BlogArticleIcon.svg?react";
// @ts-expect-error: Svg import
import TodayILearnedIcon from "assets/TodayILearnedIcon.svg?react";
import { HStack, VStack, Flex, Box, Text } from "@chakra-ui/react";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";

import "./Exercise.css";

type Props = {
  exercise: TExercise;
};

export const Exercise: React.FC<Props> = ({ exercise }) => {
  const navigate = useNavigate();

  const handleNavigateToPreviewScreen = () => {
    window.open(`/preview/${exercise.id}`, "_blank", "noopener,noreferrer");
  };

  const handleNaviagteToExecuteScreen = () => {
    navigate(`/execute/${exercise.id}`);
  };

  const type: string = exercise.type;
  const title: string = new UIBlogArticle(exercise.xml_text).getTitle() || "";

  return (
    <HStack spacing={4} align="center" className="exercise">
      <Box as="span" color="green.500">
        {type === "blog-article" && <BlogArticleIcon />}
        {type === "study-exercise" && <StudyExerciseIcon />}
        {type === "til" && <TodayILearnedIcon />}
      </Box>
      <VStack align="start" spacing="0">
        <Flex align="center">
          <Text
            fontSize={"md"}
            cursor={"pointer"}
            onClick={handleNavigateToPreviewScreen}
          >
            {title}
          </Text>
          <Box className="exercise-actions">
            <MdEdit
              cursor={"pointer"}
              onClick={handleNaviagteToExecuteScreen}
            />
          </Box>
        </Flex>
      </VStack>
    </HStack>
  );
};

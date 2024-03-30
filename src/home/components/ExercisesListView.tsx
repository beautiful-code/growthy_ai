import React, { useEffect, useState } from "react";

import { Box, Checkbox, Flex, HStack, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
// @ts-expect-error: Svg import
import BlogArticleIcon from "assets/BlogArticleIcon.svg?react";
// @ts-expect-error: Svg import
import StudyExerciseIcon from "assets/StudyExerciseIcon.svg?react";
// @ts-expect-error: Svg import
import TodayILearnedIcon from "assets/TodayILearnedIcon.svg?react";
import { TExercise, TSelectedType } from "types";
import { getAllExercisesPaginated } from "home/queries";
import PaginationTable from "common/components/PaginationTable";
import { ExerciseView } from "common/components/ExerciseView";

type Props = {
  setTitle?: (title: React.ReactNode) => void;
};

export const ExercisesListView: React.FC<Props> = ({ setTitle }) => {
  useEffect(() => {
    if (setTitle) {
      setTitle(
        <Text fontSize={"3xl"} color={"gray"}>
          Growthy at BeautifulCode
        </Text>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<TExercise[]>([]);
  const [selectedType, setSelectedType] = useState<TSelectedType>({
    all: true,
    blogArticle: false,
    studyExercise: false,
    til: false,
  });

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(10);

  useEffect(() => {
    (async () => {
      // Make "all" as default filter
      if(!selectedType.all && !selectedType.blogArticle && !selectedType.studyExercise && !selectedType.til){
        handleChecked("all")
      }      

      setLoading(true);

      // Get exercises based on selected type and pagination
      const data = await getAllExercisesPaginated( pageIndex * pageSize, ((pageIndex + 1) * pageSize) - 1, selectedType);

      if (data) {
        setExercises(data.exercises);
        setCount(data.count || 0);
      }

      setLoading(false);
    })();
  }, [pageIndex, pageSize, selectedType]);

  const handleChecked = (
    type: "all" | "blogArticle" | "studyExercise" | "til"
  ) => {
    setSelectedType((prev: TSelectedType) => {
      setPageIndex(0);
      if (type === "all") {
        return {
          all: true,
          blogArticle: false,
          studyExercise: false,
          til: false,
        };
      }
      return {
        ...prev,
        all: false,
        [type]: !prev[type],
      };
    });
  };

  return (
    <Box mt={"3%"}>
      <VStack align="start" spacing={4}>
        <Flex width="100%" align="center" justify={"space-between"}>
          <Heading size="md">What's new?</Heading>
        </Flex>
        <Heading size={"sm"} fontWeight={"normal"}>Publications from the last 7 days</Heading>
        <HStack spacing={4}>
          <Checkbox
            isChecked={selectedType["all"]}
            onChange={() => {
              handleChecked("all");
            }}
          >
            All
          </Checkbox>
          <Checkbox
            isChecked={selectedType["blogArticle"]}
            onChange={() => {
              handleChecked("blogArticle");
            }}
          >
            <Flex align="center">
              <BlogArticleIcon />
              <Text ml="4px">Blog Articles</Text>
            </Flex>
          </Checkbox>
          <Checkbox
            isChecked={selectedType["studyExercise"]}
            onChange={() => {
              handleChecked("studyExercise");
            }}
          >
            <Flex align="center">
              <StudyExerciseIcon />
              <Text ml="4px">Study Exercises</Text>
            </Flex>
          </Checkbox>
          <Checkbox
            isChecked={selectedType["til"]}
            onChange={() => {
              handleChecked("til");
            }}
          >
            <Flex align="center">
              <TodayILearnedIcon />
              <Text ml="4px">Today I Learned</Text>
            </Flex>
          </Checkbox>
        </HStack>
        <VStack align="start" spacing={2}>
          {loading && <Spinner />}
          {exercises.map((exercise) => (
            <ExerciseView key={exercise.id} exercise={exercise} />
          ))}
        </VStack>  
      </VStack>
      <PaginationTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        totalItemsCount={count}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

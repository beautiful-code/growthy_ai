import React, { useState } from "react";

import { Box, Checkbox, Flex, HStack, Text, VStack } from "@chakra-ui/react";
// @ts-expect-error: Svg import
import BlogArticleIcon from "assets/BlogArticleIcon.svg?react";
// @ts-expect-error: Svg import
import StudyExerciseIcon from "assets/StudyExerciseIcon.svg?react";
// @ts-expect-error: Svg import
import TodayILearnedIcon from "assets/TodayILearnedIcon.svg?react";
import { TExerciseFilter } from "types";
import PaginationTable from "common/components/PaginationTable";
import { Exercise } from "common/components/Exercise";
import { useGetExercisesPaginated } from "common/hooks";

export type ExercisesProps = {
  title: string;
  defaultDuration?: number;
  type: "published" | "unpublished";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryFunction: ({
    filters,
    lowerLimit,
    upperLimit,
    guildId,
  }: {
    filters: TExerciseFilter;
    lowerLimit?: number;
    upperLimit?: number;
    guildId?: string;
  }) => Promise<any>;
  guildId?: string;
};

export const Exercises: React.FC<ExercisesProps> = ({
  title,
  defaultDuration,
  type,
  queryFunction,
  guildId,
}) => {
  const [filters, setFilters] = useState<TExerciseFilter>({
    blogArticle: false,
    studyExercise: false,
    til: false,
  });

  const isTypePublished = type === "published";

  // UI states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageInfo = { pageIndex, pageSize };

  const { exercises, isLoading, isFetching } = useGetExercisesPaginated(
    pageInfo,
    filters,
    queryFunction,
    type,
    guildId
  );

  const handleChecked = (type: "blogArticle" | "studyExercise" | "til") => {
    setFilters((prev: TExerciseFilter) => {
      setPageIndex(0);
      return {
        ...prev,
        all: false,
        [type]: !prev[type],
      };
    });
  };

  return (
    <Box mt={"3%"} width={"100%"}>
      <VStack align="start" spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight={"normal"}>
          {title}
          {defaultDuration != 0 && defaultDuration && (
            <Text as="span" color={"blue"}>
              {defaultDuration} days
            </Text>
          )}
          {isFetching && (
            <Text as="span" fontSize="2xl" fontWeight={"normal"} ml={"20px"}>
              Loading...
            </Text>
          )}
        </Text>

        {!isLoading && (
          <>
            {isTypePublished && (
              <HStack spacing={4}>
                <Checkbox
                  isChecked={filters["blogArticle"]}
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
                  isChecked={filters["studyExercise"]}
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
                  isChecked={filters["til"]}
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
            )}
            <VStack align="start" spacing={2}>
              {exercises.map((exercise) => (
                <Exercise key={exercise.id} exercise={exercise} />
              ))}
            </VStack>
            {isTypePublished && exercises.length > 0 && (
              <PaginationTable
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                totalItemsCount={exercises.length}
                pageSizeOptions={[10, 25, 50]}
              />
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

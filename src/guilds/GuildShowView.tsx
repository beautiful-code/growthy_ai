import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  GridItem,
  Text,
  Button,
  Flex,
  Box,
  HStack,
  Stack,
} from "@chakra-ui/react";

import { Sidebar } from "common/components/Sidebar";

// @ts-expect-error: Svg import
import StudyExerciseIcon from "assets/StudyExerciseIcon.svg?react";
// @ts-expect-error: Svg import
import BlogArticleIcon from "assets/BlogArticleIcon.svg?react";
// @ts-expect-error: Svg import
import TodayILearnedIcon from "assets/TodayILearnedIcon.svg?react";

type Props = {};

export const GuildShowView: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showGrowthExercises, setShowGrowthExercises] = useState(false);

  const handleShowGrowthExercises = () => {
    setShowGrowthExercises(!showGrowthExercises);
  };

  const handleCreateGE = (type: "study" | "blog-article" | "til") => {
    navigate(`/guild/${id}/create-growth-exercise/${type}`);
  };

  return (
    <Grid templateColumns={"30% 70%"}>
      <GridItem>
        <Sidebar />
      </GridItem>
      <GridItem>
        <Flex mt="16px" align={"center"}>
          <Text fontSize={"medium"}>Some Guild at Beautiful Code</Text>
          <Button
            size="xs"
            ml="8px"
            backgroundColor={"white"}
            color={"primary.500"}
            borderColor={"primary.500"}
            border={"1px solid"}
            onClick={handleShowGrowthExercises}
          >
            Add Growth Exercise
          </Button>
        </Flex>
        <Box mt="8px">
          {showGrowthExercises && (
            <HStack spacing={8}>
              <Stack
                spacing={3}
                p={6}
                bg="white"
                borderWidth="1px"
                borderRadius="lg"
                alignItems="center"
                boxShadow="sm"
                width="260px"
                height="200px"
                cursor={"pointer"}
                _hover={{ boxShadow: "md" }}
                onClick={() => handleCreateGE("study")}
              >
                <Flex align={"center"}>
                  <StudyExerciseIcon w={12} h={12} />
                  <Text ml="8px" fontSize="lg">
                    Study Exercise
                  </Text>
                </Flex>
                <Text>Learn by researching and doing</Text>
                <Text fontSize="sm" color="#006400">
                  Avg Time: 5 hrs
                </Text>
              </Stack>
              <Stack
                spacing={3}
                p={6}
                bg="white"
                borderWidth="1px"
                borderRadius="lg"
                alignItems="center"
                boxShadow="sm"
                width="260px"
                height="200px"
                cursor={"pointer"}
                _hover={{ boxShadow: "md" }}
                onClick={() => handleCreateGE("blog-article")}
              >
                <Flex align={"center"}>
                  <BlogArticleIcon w={12} h={12} />
                  <Text ml="8px" fontSize="lg">
                    Blog Article
                  </Text>
                </Flex>
                <Text>Solidify your understanding by writing</Text>
                <Text fontSize="sm" color="#006400">
                  Avg Time: 1hr
                </Text>
              </Stack>
              <Stack
                spacing={3}
                p={6}
                bg="white"
                borderWidth="1px"
                borderRadius="lg"
                alignItems="center"
                boxShadow="sm"
                width="260px"
                height="200px"
                cursor={"pointer"}
                _hover={{ boxShadow: "md" }}
              >
                <Flex align={"center"}>
                  <TodayILearnedIcon w={12} h={12} />
                  <Text ml="8px" fontSize="lg">
                    Today I Learned
                  </Text>
                </Flex>
                <Text>Log your day to day learnings</Text>
                <Text fontSize="sm" color="#006400">
                  Avg Time: 15 mins
                </Text>
              </Stack>
            </HStack>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
};

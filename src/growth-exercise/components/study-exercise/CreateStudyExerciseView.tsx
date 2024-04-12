import React, { useState } from "react";
import { Box, Flex, Text, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

import { UserAvatar } from "common/components/header/UserAvatar";
import { NavMenu } from "common/components/header/NavMenu";
import { StudyExerciseForm } from "./StudyExerciseForm";

export const CreateStudyExerciseView: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [learningObjective, setLearningObjective] = useState("");
  const [constraints, setConstraints] = useState("");
  const [timeSpent, setTimeSpent] = useState("2");

  const handleBack = () => {
    window.history.back();
  };

  const handleSuggest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Box mx={"10%"} my={"20px"}>
      <Grid templateColumns="70% 30%">
        <GridItem colSpan={1}>
          <Flex>
            <Box cursor={"pointer"}>
              <MdArrowBack fontSize="24px" onClick={handleBack} />
            </Box>
            <Text ml="8px" fontSize={"large"} color={"grey"}>
              Guided Ideation on your Study Exercise
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex mr={"20%"} width="100%" justify={"flex-end"} align="center">
            <UserAvatar />
            <NavMenu />
          </Flex>
        </GridItem>
      </Grid>

      <StudyExerciseForm
        learningObjective={learningObjective}
        setLearningObjective={setLearningObjective}
        constraints={constraints}
        setConstraints={setConstraints}
        timeSpent={timeSpent}
        setTimeSpent={setTimeSpent}
        handleSubmit={handleSuggest}
      />

      {loading ? (
        <Text mt="32px" as={Flex} align="center">
          Generating ideas...
          <Spinner fontSize={"18px"} />
        </Text>
      ) : (
        <></>
      )}
    </Box>
  );
};

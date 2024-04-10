import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  VStack,
} from "@chakra-ui/react";
import { GButton } from "common/components/GButton";

type Props = {
  learningObjective: string;
  setLearningObjective: (learningObjective: string) => void;
  constraints: string;
  setConstraints: (constraints: string) => void;
  timeSpent: string;
  setTimeSpent: (timeSpent: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const StudyExerciseForm: React.FC<Props> = ({
  learningObjective,
  setLearningObjective,
  constraints,
  setConstraints,
  timeSpent,
  setTimeSpent,
  handleSubmit,
}) => {
  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>What do you want the learner to learn?</FormLabel>
            <Input
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              (Optional) Add constraints to the Study Exercise
            </FormLabel>
            <Textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </FormControl>

          <FormControl as="fieldset">
            <FormLabel as="legend">
              How much average time should the learner spend?
            </FormLabel>
            <RadioGroup onChange={setTimeSpent} value={timeSpent}>
              <Stack direction="row">
                <Radio value="2">2 hrs</Radio>
                <Radio value="4">4 hrs</Radio>
                <Radio value="8">8 hrs</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <GButton type="primary" htmlType="submit">
            Get Suggestions
          </GButton>
        </VStack>
      </form>
    </Box>
  );
};

export default StudyExerciseForm;

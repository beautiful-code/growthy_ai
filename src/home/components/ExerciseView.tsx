import React from "react";

import { Exercise } from "domain/exercise/Exercise";

type Props = {
  exercise: Exercise;
};

export const ExerciseView: React.FC<Props> = ({ exercise }) => {
  return <div>{exercise.name}</div>;
};

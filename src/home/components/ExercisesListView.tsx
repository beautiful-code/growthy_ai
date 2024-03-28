import React from "react";

import { useGetExercises } from "home/hooks";
import { ExerciseView } from "home/components/ExerciseView";

type Props = {};

export const ExercisesListView: React.FC<Props> = () => {
  const { exercises } = useGetExercises();

  return (
    <div>
      {exercises.map((exercise, index) => (
        <ExerciseView key={index} exercise={exercise} />
      ))}
    </div>
  );
};

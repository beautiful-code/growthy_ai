import { useState, useEffect } from "react";

import { getExercises } from "home/queries";
import { Exercise } from "domain/exercise/Exercise";

export const useGetExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    getExercises().then((exercises) => {
      const exercisesList = exercises.map((exercise) => new Exercise(exercise));
      setExercises(exercisesList);
    });
  }, []);

  return { exercises };
};

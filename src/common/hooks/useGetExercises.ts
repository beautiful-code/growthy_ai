import { useState, useEffect } from "react";

import { getExercises } from "home/queries";
import { TExercise } from "types";

export const useGetExercises = (setLoading: (arg0: boolean) => void) => {
  const [exercises, setExercises] = useState<TExercise[]>([]);

  useEffect(() => {
    ( async () => {
      setLoading(true);
      const exercises = await getExercises()
      setExercises(exercises ? exercises : []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return exercises;
};

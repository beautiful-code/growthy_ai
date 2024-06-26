import { useQuery } from "@tanstack/react-query";
import { getExercisePublication } from "publication/queries";

export const useGetExercisePublication = (exerciseId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["exercisepublication", exerciseId],
    queryFn: () => getExercisePublication(exerciseId),
  });

  return { data, isLoading };
};

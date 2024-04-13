import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";

import { TGrowthExercise } from "types";

type TUseGetExercise = {
  exercise: TGrowthExercise | null;
  isLoading: boolean;
  refetch: () => void;
};

export const useGetExercise = (
  id: string,
  getExercise: (
    id: string
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>
): TUseGetExercise => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["exercise", id],
    queryFn: () => getExercise(id),
  });

  return { exercise: data?.data || null, isLoading, refetch };
};

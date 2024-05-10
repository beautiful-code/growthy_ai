import { useQuery } from "@tanstack/react-query";
import { getExercisePreview as defaultGetExercisePreview } from "execute/queries";
import { PreviewSection } from "types";

export const useGetExercisePreview = ({
  exerciseId,
  getExercisePreview = defaultGetExercisePreview,
}: {
  exerciseId: string;
  getExercisePreview?: (
    exerciseId: string
  ) => Promise<PreviewSection[] | undefined>;
}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["exercise-preivew", exerciseId],
    queryFn: () => getExercisePreview(exerciseId),
  });

  const generatedSections = data?.filter((section) => {
    const tasks = section.tasks;
    return tasks.some((task) => task.content);
  });

  const completedSections = data?.filter((section) => {
    const tasks = section.tasks;
    return tasks.some((task) => !task.content && task.isChecked);
  });

  return { generatedSections, completedSections, isLoading, refetch };
};

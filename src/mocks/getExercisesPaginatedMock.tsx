import { getFilters } from "common/utils";
import { TExerciseFilter, TExercise } from "types";

const generateMockExercises = (
  lowerLimit: number,
  upperLimit: number,
  filters: TExerciseFilter
): TExercise[] => {
  const exercises: TExercise[] = [];
  const types = getFilters(filters);
  for (let i = lowerLimit; i <= upperLimit; i++) {
    const randomIndex = Math.floor(Math.random() * types.length);
    const type = types[randomIndex];
    exercises.push({
      id: i.toString(),
      xml_text: "",
      user_id: `user${i}`,
      guild_id: `guild${i}`,
      type: type as "study-exercise" | "blog-article",
    });
  }

  return exercises;
};

export const getExercisesPaginatedMock = async ({
  filters,
  lowerLimit = 0,
  upperLimit = 5,
}: {
  filters: TExerciseFilter;
  lowerLimit?: number;
  upperLimit?: number;
}): Promise<{ exercises: TExercise[] }> => {
  // Simulate database call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exercises = generateMockExercises(lowerLimit, upperLimit, filters);

  return { exercises };
};

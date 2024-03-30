import { supabaseClient } from "supabaseClient";
import { TSelectedType } from "types";

export const getExercises = async () => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("id, title, user_id, guild_id, type")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error", error);
    return;
  }

  console.log("data", data);

  return data;
};

// Fetch all exercises based on selected type and with pagination
export const getAllExercisesPaginated = async (lowerLimit: number, upperLimit: number, selectedType: TSelectedType) => {
  
  const types =
    (selectedType.blogArticle && selectedType.studyExercise) ||
    selectedType.all
      ? ["study-exercise", "blog-article"]
      : selectedType.blogArticle
      ? ["blog-article"]
      : selectedType.studyExercise 
      ? ["study-exercise"]
      : [];

  const { data, error, count } = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id", { count: 'exact' })
    .range(lowerLimit, upperLimit)
    .in('type', types)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error", error);
    return;
  }

  return {exercises: data, count};
};
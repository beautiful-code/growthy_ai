import { getCurrentUserId, getFilters } from "common/utils";
import { supabaseClient } from "supabaseClient";
import { TExerciseFilter } from "types";

export const getUnpublishedExercisesForUser = async (
  {filters}:
  {filters: TExerciseFilter, lowerLimit?: number, upperLimit?: number}
) => {
  const userId = await getCurrentUserId();
  const filter = getFilters(filters);

  const { data, error} = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id")
    .match({ user_id: userId })
    .in('type', filter)
    .in("state", ["created", "outlined"])
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }

  return {exercises: data};
};

export const getPublishedExercisesForUser = async (
  {filters, lowerLimit, upperLimit}:
  {filters: TExerciseFilter, lowerLimit?: number, upperLimit?: number}
) => {
  const userId = await getCurrentUserId();
  const filter = getFilters(filters);

  
  const { data, error} = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id")
    .range(lowerLimit!, upperLimit!)
    .match({ user_id: userId })
    .in('type', filter)
    .in("state", ["published", "created", "outlined"])
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }

  return {exercises: data};
};
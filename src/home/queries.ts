import { getFilters } from "common/utils";
import { supabaseClient } from "supabaseClient";
import { TExerciseFilter } from "types";

// Fetch exercises based on filters and with pagination
export const getExercisesPaginated = async ({filters, lowerLimit, upperLimit}:{filters: TExerciseFilter, lowerLimit?: number, upperLimit?: number}) => {
  const filter: string[] = getFilters(filters);

  // TODO: Modify to only published in future
  const state: string[] = ["published", "outlined", "created"]; 

  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id")
    .range(lowerLimit!, upperLimit!)
    .in('type', filter)
    .in('state', state)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error", error);
    return;
  }

  return {exercises: data};
};
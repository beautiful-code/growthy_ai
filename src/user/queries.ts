import { supabaseClient } from "supabaseClient";
import { TExercise } from "types";

export const getExercisesForUser = async (
    userId: string
): Promise<TExercise[] | undefined> => {
    const { data, error } = await supabaseClient
      .from("growth_exercise")
      .select("*")
      .match({ user_id: userId })
      .order("created_at", { ascending: false }); 
  
    if (error) {
      console.log("error", error);
      return;
    }
  
    return data;
};
import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

import { TGrowthExercise } from "types";

export const getExercise = async (
  id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .eq("id", id);

  return { data: data ? data[0] : null, error };
};

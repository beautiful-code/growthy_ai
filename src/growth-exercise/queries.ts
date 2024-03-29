import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "supabaseClient";

import { TGrowthExercise } from "types";
import { getCurrentUserId } from "common/utils";

export const saveGrowthExercise = async (
  growthExercise: TGrowthExercise
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabaseClient.from("growth_exercise").upsert({
    ...growthExercise,
    user_id: userId,
  });

  return { data, error };
};

export const getMyGrowthExercises = async (
  userId: string
): Promise<{
  data: TGrowthExercise[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabaseClient
    .from("ideas")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const getGrowthExerciseById = async (
  id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .eq("id", id);

  return { data: data ? data[0] : null, error };
};

export const getGrowthExerciseByGuildId = async (
  guildId: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .eq("guild_id", guildId);

  return { data: data ? data[0] : null, error };
};

export const deleteGrowthExercise = async (
  id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .delete()
    .eq("id", id);

  return { data, error };
};

import { supabaseClient } from "supabaseClient";
import { TExercise, TGuildUser } from "types";
import { getCurrentUserId, getUserById } from "utils";

export const getAllGuilds = async () => {
    const { data, error } = await supabaseClient
      .from("guilds")
      .select("id, name, led_by")
  
    if (error) {
      console.log("error", error);
      return;
    }

    return data;
};

export const getGuildById = async (guildId: string) => {
    const { data, error } = await supabaseClient
        .from("guilds")
        .select("id, name, led_by")
        .eq("id", guildId)
        .single()
        
    if (error) {
      console.log("error", error);
      return;
    }

    const ledByUser = await getUserById(data.led_by);

    const guildUser: TGuildUser = {
      id: data.id,
      name: data.name,
      led_by: data.led_by,
    }

    if(ledByUser) {
      guildUser.user = ledByUser;
    }

    return guildUser;
}

export const getExercisesForUserInGuild = async (
  guildId: string
): Promise<TExercise[] | undefined> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .match({ guild_id: guildId, user_id: userId })
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }

  return data;
};

export const getExercisesForGuild = async (
  guildId: string
): Promise<TExercise[] | undefined> => {
  const { data: guildExercises, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .match({ guild_id: guildId})
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }

  return guildExercises;
};

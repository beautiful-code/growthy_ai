import { getCurrentUserId, getFilters, getUserById } from "common/utils";
import { supabaseClient } from "supabaseClient";
import { TExerciseFilter, TGuildUser } from "types";

export const getAllGuilds = async () => {
    const { data, error } = await supabaseClient
      .from("guilds")
      .select("id, name, led_by")
  
    if (error) {
      console.log("error", error);
      return;
    }

    return {guilds: data};
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

export const getUnpublishedExercisesInGuild = async (
  {filters, guildId}:
  {filters: TExerciseFilter,
  guildId?: string,
  lowerLimit?: number, upperLimit?: number}
) => {
  const userId = await getCurrentUserId();
  const filter = getFilters(filters);

  const { data, error} = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id")
    .match({ guild_id: guildId, user_id: userId })
    .in('type', filter)
    .in("state", ["created", "outlined"])
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }

  return {exercises: data};
};

export const getPublishedExercisesInGuild = async (
  {filters, guildId, lowerLimit, upperLimit}:
  {filters: TExerciseFilter, guildId?: string, lowerLimit?: number, upperLimit?: number}
) => {
  const filter = getFilters(filters);

  const { data, error} = await supabaseClient
    .from("growth_exercise")
    .select("id, type, title, user_id")
    .range(lowerLimit!, upperLimit!)
    .match({ guild_id: guildId })
    .in('type', filter)
    .in("state", ["published", "created", "outlined"])
    .order("created_at", { ascending: false }); 

  if (error) {
    console.log("error", error);
    return;
  }
  
  return {exercises: data};
};


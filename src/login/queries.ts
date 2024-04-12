import { supabaseClient } from "supabaseClient";

import { TUser } from "types";

export const createUserIfNotExists = async (user: TUser) => {
  const { data, error } = await supabaseClient
    .from("users")
    .upsert(user)
    .select();

  if (error) {
    console.error("Error signing up:", error.message);
    return null;
  }

  return { data };
};

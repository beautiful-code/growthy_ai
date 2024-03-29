import { supabaseClient } from "supabaseClient";

export const getCurrentUserId = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session?.user?.id;
};

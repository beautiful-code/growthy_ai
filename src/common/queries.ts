import { supabaseClient } from "supabaseClient";
import { TUser } from "types";

export const getUserById = async (id: string): Promise<TUser | null> => {
    // Return only one user by id
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      console.log("error", error);
      return null;
    }
  
    return data as TUser;
};
  
export const getCurrentUserId = async () => {
    const {
        data: { session },
    } = await supabaseClient.auth.getSession();
    
    return session?.user?.id;
};
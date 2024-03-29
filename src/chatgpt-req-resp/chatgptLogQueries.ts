import { supabaseClient } from "supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const saveReqRespPair = async ({
  req,
  resp,
  name,
}: {
  req: string;
  resp: string;
  name: string;
}) => {
  const { data, error } = await supabaseClient
    .from("chatgpt_req_resp") // Table name
    .insert([{ id: uuidv4(), req: req, resp: resp, name: name }]);

  if (error) {
    throw error;
  }

  return { data, error };
};

// This function will query the database for a single request-response pair also sort based on created_at
export const getReqRespPairs = async () => {
  const { data, error } = await supabaseClient
    .from("chatgpt_req_resp")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return { data, error };
};

export const getReqRespPairById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from("chatgpt_req_resp")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return { data, error };
};

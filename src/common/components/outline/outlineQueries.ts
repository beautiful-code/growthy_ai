import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { TNode } from "types";

export const getNodes = async (
  growthExercieId: string
): Promise<{
  data: TNode[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabaseClient
    .from("nodes")
    .select("*")
    .eq("growth_exercise_id", growthExercieId);

  return { data, error };
};

export const saveNode = async (
  node: TNode
): Promise<{ data: TNode | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient.from("nodes").upsert({
    ...node,
  });

  return { data, error };
};

export const saveNodes = async (
  nodes: TNode[]
): Promise<{ data: TNode[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient.from("nodes").upsert(nodes);

  return { data, error };
};

export const deleteNode = async (
  nodeId: string
): Promise<{ data: TNode | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("nodes")
    .delete()
    .eq("id", nodeId);

  return { data, error };
};

export const deleteNodes = async (
  nodeIds: string[]
): Promise<{ data: TNode[] | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("nodes")
    .delete()
    .in("id", nodeIds);

  return { data, error };
};

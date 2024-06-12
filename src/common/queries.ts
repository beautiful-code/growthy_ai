import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { TUser, TGrowthyConversation } from "types";
import { TComment } from "./components/slate-editor/Comments";

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

export const getPersistedConversations = async (
  id: string
): Promise<{ data: TGrowthyConversation[]; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growthy_conversations")
    .select("*")
    .eq("resourceId", id)
    .order("created_at", { ascending: true });
  if (error) {
    console.log("error", error);
    return { data: [], error: error };
  }

  return { data: data as TGrowthyConversation[], error: null };
};

export const persistConversation = async (
  conversation: TGrowthyConversation
): Promise<{
  data: TGrowthyConversation | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabaseClient
    .from("growthy_conversations")
    .upsert([conversation]);

  if (error) {
    console.log("error", error);
    return { data: null, error: error };
  }

  return { data: data as TGrowthyConversation | null, error: null };
};

export const saveEditorComments = async (
  comments: TComment[]
): Promise<{
  error: PostgrestError | null;
}> => {
  const userId = await getCurrentUserId();

  const { error } = await supabaseClient.from("comments").upsert(
    comments.map((comment) => ({
      selection_id: comment.commentId,
      author: userId,
      text: comment.text,
    }))
  );

  if (error) {
    console.log("error", error);
    return { error };
  }

  return { error: null };
};

export const updateEditorComment = async (
  comment: TComment
): Promise<{
  error: PostgrestError | null;
}> => {
  const { error } = await supabaseClient
    .from("comments")
    .update({ text: comment.text })
    .eq("id", comment.dbId)
    .eq("selection_id", comment.commentId);

  if (error) {
    console.log("error", error);
    return { error };
  }

  return { error: null };
};

export const getEditorComments = async (
  commentId: string
): Promise<{
  data: TComment[] | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .eq("selection_id", commentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("error", error);
    return { data: null, error };
  }

  const res: TComment[] = [];

  for (const comment of data) {
    comment.enableReply = false;
    const user = await getUserById(comment.author);

    if (user) {
      res.push({
        commentId: comment.selection_id,
        text: comment.text,
        author: user,
        enableReply: false,
        dbId: comment.id,
      });
    }
  }

  console.log("query", { commentId, res });

  return { data: res, error: null };
};

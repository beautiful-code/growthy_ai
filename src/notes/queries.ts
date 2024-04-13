import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

import type { TNote } from "types";

export const saveNote = async (note: TNote) => {
  const { data, error } = await supabaseClient.from("notes").upsert(note);

  return { data, error };
};

export const deleteNote = async (noteId: string) => {
  const { data, error } = await supabaseClient
    .from("notes")
    .delete()
    .eq("id", noteId);

  return { data, error };
};

export const storeImage = async (
  file: File
): Promise<{ data: { path: string } | null; error: Error | null }> => {
  const { data, error } = await supabaseClient.storage
    .from("note_images")
    .upload(`${file.name}-${uuidv4()}`, file);

  return { data, error };
};

export const getNoteByTaskId = async (
  taskId: string
): Promise<{ note: TNote | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("notes")
    .select("*")
    .eq("task_id", taskId)
    .single();

  return { note: data, error };
};

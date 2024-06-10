import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UISection } from "domain/common/UISection";

import { getContentByTaskIds } from "publication/queries";
import {
  TGrowthExercise,
  PreviewSection,
  Dictionary,
  TTaskNote,
  TGeneratedTasksContent,
} from "types";

export const getExercise = async (
  id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("*")
    .eq("id", id);

  return { data: data ? data[0] : null, error };
};

export const getExercisePreview = async (exerciseId: string) => {
  const { data, error } = await supabaseClient
    .from("growth_exercise")
    .select("id, type, xml_text")
    .eq("id", exerciseId)
    .single();

  if (error) {
    console.log("error", error);
    return;
  }

  const xmlText: string = data.xml_text;
  const blogArticle: UIBlogArticle = new UIBlogArticle(xmlText);
  const sections: UISection[] = blogArticle?.getOutline()?.getSections() || [];

  const allTaskIds = sections.flatMap((section) =>
    section.getUITasks().map((task) => task.getUUID())
  );
  // fetch content for all tasks
  const bulkContent = (await getContentByTaskIds(allTaskIds)) || [];
  const taskContent: Dictionary = {};
  bulkContent.forEach((content) => {
    taskContent[content.task_id] = content.data;
  });

  const previewSections: PreviewSection[] = sections.map((section) => {
    const sectionTasks = section.getUITasks();

    const sectionTasksWithContent = sectionTasks.map((task) => {
      return {
        title: task.getText(),
        id: task.getUUID(),
        content: taskContent[task.getUUID()] || "",
        isChecked: task.getChecked(),
      };
    });

    return {
      title: section.getSectionName(),
      tasks: sectionTasksWithContent,
    };
  });

  return previewSections;
};

export const saveBulkTasksContent = async (tasks: TGeneratedTasksContent[]) => {
  const { data, error } = await supabaseClient.from("content").upsert(tasks);

  return { data, error };
};

export const updateTaskContent = async (task: TGeneratedTasksContent) => {
  const { error } = await supabaseClient
    .from("content")
    .update({ data: task.data })
    .eq("task_id", task.task_id);

  if (error) {
    console.log("error", error);
  }

  return { error };
};

export const getBulkTaskNotes = async (
  taskIds: string[]
): Promise<{ data: TTaskNote[]; error: PostgrestError | null }> => {
  const { data, error } = await supabaseClient
    .from("notes")
    .select("*")
    .in("task_id", taskIds);

  if (error) {
    console.log("error", error);
    return { data: [], error };
  }

  return { data, error };
};

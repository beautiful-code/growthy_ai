import { supabaseClient } from "supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UISection } from "domain/common/UISection";

import { getContentByTaskIds } from "publication/queries";
import { TGrowthExercise, PreviewSection, Dictionary } from "types";

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
    taskContent[content.task_id] = content.data.join("\n");
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

export const saveBulkTasksContent = async (
  tasks: {
    taskId: string;
    content: string;
  }[]
) => {
  const { data, error } = await supabaseClient
    .from("task_content")
    .upsert(tasks);

  return { data, error };
};

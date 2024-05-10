import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UISection } from "domain/common/UISection";
import { supabaseClient } from "supabaseClient";
import { PublicationSection, ExercisePublication } from "types";

export const getExercisePublication = async (exerciseId: string) => {
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
  const publicationTitle = blogArticle.getTitle() || "";
  const sections: UISection[] = blogArticle?.getOutline()?.getSections() || [];

  const allTaskIds = sections.flatMap((section) =>
    section.getUITasks().map((task) => task.getUUID())
  );
  // fetch content for all tasks
  const bulkContent = (await getContentByTaskIds(allTaskIds)) || [];

  const publicationSections: PublicationSection[] = sections.map((section) => {
    const sectionTasks = section.getUITasks();
    // filter bulkContent to only include content that belongs to tasks in this section
    const sectionContent = bulkContent.filter((contentItem) => {
      const contentTaskId: string = contentItem.task_id;
      return sectionTasks.some((task) => task.getUUID() === contentTaskId);
    });

    return {
      title: section.getSectionName(),
      content: sectionContent.map((content) => content.data).join("\n"),
    };
  });

  return {
    title: publicationTitle,
    sections: publicationSections,
  } as ExercisePublication;
};

export const getContentByTaskIds = async (taskIds: string[]) => {
  const { data, error } = await supabaseClient
    .from("content")
    .select("task_id, data")
    .in("task_id", taskIds);

  if (error) {
    console.log("error", error);
    return;
  }

  return data;
};

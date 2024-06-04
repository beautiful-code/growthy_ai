import { PreviewSection } from "types";

export const getTasksTitles = (sections: PreviewSection[]): string[] => {
  const tasks = sections.flatMap((section) => {
    const sectionTasks = section.tasks;
    return sectionTasks;
  });

  return tasks?.map((task) => task.title);
};

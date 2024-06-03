import { UISection } from "domain/common/UISection";
export const getTasksTitles = (sections: UISection[]): string[] => {
  const tasks = sections.flatMap((section) => {
    const sectionTasks = section.getUITasks();
    return sectionTasks;
  });

  return tasks?.map((task) => task.getTitle());
};

import { v4 as uuidv4 } from "uuid";

import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";
import { UITask } from "domain/common/UITask";

/**
 * UISection is a class that represents a section in a blog article.
 *
 * Section look like this
 *
 * `<Section name="section1"><Task name="task1" /><Task name="task2" /></Section>`
 */
export class UISection extends UIXMLInterfacer {
  getSectionName(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    return section[0]?.getAttribute("name") || "";
  }

  updateSectionName(name: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    section[0].setAttribute("name", name);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getIsExpanded(): boolean {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    const expanded = section[0]?.getAttribute("expanded");
    return expanded === "true";
  }

  // Adds an attribute expanded=true if it is false or not present in section xml and updates xml
  // if expanded is true, it sets it to false
  expandSection(): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    section[0].setAttribute("expanded", "true");
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  collapseSection(): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    section[0].setAttribute("expanded", "false");
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getUITasks(): UITask[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const tasks = xmlDoc.getElementsByTagName("Task");
    return Array.from(tasks).map(
      (task) =>
        new UITask({
          uuid: uuidv4(),
          xml: new XMLSerializer().serializeToString(task),
        })
    );
  }

  getSelectedTaskId(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const tasks = xmlDoc.getElementsByTagName("Task");
    return (
      Array.from(tasks)
        .find((task) => task.getAttribute("selected") === "true")
        ?.getAttribute("uuid") || ""
    );
  }

  getSelectedTaskName(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const tasks = xmlDoc.getElementsByTagName("Task");
    return (
      Array.from(tasks)
        .find((task) => task.getAttribute("selected") === "true")
        ?.getAttribute("name") || ""
    );
  }

  selectTask(taskId: string): void {
    const tasks = this.getUITasks();
    tasks.forEach((task) => {
      if (task.getUUID() === taskId) {
        task.selectTask(taskId);
      } else {
        task.deselectTask();
      }
    });

    let updatedXML = `<Section name="${this.getSectionName()}" expanded="${this.getIsExpanded()}">`;
    tasks.forEach((task) => {
      updatedXML += task._xml;
    });
    updatedXML += `</Section>`;
    this._xml = updatedXML;
  }

  addTask(task: UITask): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    const taskXML = parser.parseFromString(task._xml, "text/xml");
    const taskNode = xmlDoc.importNode(
      taskXML.getElementsByTagName("Task")[0],
      true
    );
    section[0].appendChild(taskNode);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  updateTask(taskIndex: number, uiTask: UITask): void {
    const tasks = this.getUITasks();
    tasks[taskIndex] = uiTask;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    const taskXML = parser.parseFromString(uiTask._xml, "text/xml");
    const taskNode = xmlDoc.importNode(
      taskXML.getElementsByTagName("Task")[0],
      true
    );
    section[0].replaceChild(
      taskNode,
      section[0].getElementsByTagName("Task")[taskIndex]
    );
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getCompletionProgress(): number {
    const tasks = this.getUITasks();
    const completedTasks = tasks.filter((task) => task.getChecked());
    return (completedTasks.length / tasks.length) * 100;
  }

  getUIStatelessXML(): string {
    const name = this.getSectionName();
    const tasks = this.getUITasks()
      .map((task) => task.getUIStatelessXML())
      .join("\n");
    return `<Section name="${name}">${tasks}</Section>`;
  }
}

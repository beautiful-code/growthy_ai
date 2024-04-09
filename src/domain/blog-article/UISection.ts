import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";
import { UITask } from "./UITask";

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
    return section[0].getAttribute("name") || "";
  }

  updateSectionName(name: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    section[0].setAttribute("name", name);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getUITasks(): UITask[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const tasks = xmlDoc.getElementsByTagName("Task");
    return Array.from(tasks).map(
      (task) => new UITask(new XMLSerializer().serializeToString(task))
    );
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

  updateTask(taskIndex: number, taskXML: string): void {
    const tasks = this.getUITasks();
    tasks[taskIndex]._xml = taskXML;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const section = xmlDoc.getElementsByTagName("Section");
    const task = parser.parseFromString(taskXML, "text/xml");
    const taskNode = xmlDoc.importNode(
      task.getElementsByTagName("Task")[0],
      true
    );
    section[0].replaceChild(
      taskNode,
      section[0].getElementsByTagName("Task")[taskIndex]
    );
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getUIStatelessXML(): string {
    const name = this.getSectionName();
    const tasks = this.getUITasks()
      .map((task) => task.getUIStatelessXML())
      .join("\n");
    return `<Section name="${name}">${tasks}</Section>`;
  }
}

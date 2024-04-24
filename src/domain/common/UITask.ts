import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";

// This class is the domain object for task in outline
// The xml looks like this <Task uuid="1234" name="Task 1" checked="true" />
//<Task> can optionally have a <Content> child tag. This content will eventually be part of the final article. This is captured in Markdown format.

export class UITask extends UIXMLInterfacer {
  // Checks if the xml has id attribute
  // if it doesnt, it will add it
  // if it does, it will preserve it
  constructor({ uuid, xml }: { uuid: string; xml: string }) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    if (task[0] && task[0]?.getAttribute("uuid") === null) {
      task[0].setAttribute("uuid", uuid);
    }
    super(new XMLSerializer().serializeToString(xmlDoc));
  }

  getText(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0]?.getAttribute("name") || "";
  }

  getUUID(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0]?.getAttribute("uuid") || "";
  }

  updateText(text: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    task[0].setAttribute("name", text);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getChecked(): boolean {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0]?.getAttribute("checked") === "true";
  }

  updateChecked(checked: boolean): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    task[0].setAttribute("checked", checked ? "true" : "false");
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getIsSelected(): boolean {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0]?.getAttribute("selected") === "true";
  }

  selectTask(taskId: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    if (task[0].getAttribute("uuid") === taskId) {
      task[0].setAttribute("selected", "true");
    }
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  deselectTask(): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    task[0].removeAttribute("selected");
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getContent(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const content = xmlDoc.getElementsByTagName("Content");
    return content[0]?.textContent || "";
  }

  getUIStatelessXML(): string {
    const text = this.getText();
    const uuid = this.getUUID();
    const checked = this.getChecked();
    return `<Task name="${text}" uuid="${uuid}" checked="${checked}" />`;
  }
}

import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";

export class UITask extends UIXMLInterfacer {
  getText(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0].getAttribute("name") || "";
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
    return task[0].getAttribute("checked") === "true";
  }

  updateChecked(checked: boolean): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    task[0].setAttribute("checked", checked ? "true" : "false");
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getUIStatelessXML(): string {
    const text = this.getText();
    return `<Task name="${text}" />`;
  }
}

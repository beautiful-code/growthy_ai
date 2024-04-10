import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";

// This class is the domain object for task in outline
// The xml looks like this <Task uuid="1234" name="Task 1" checked="true" />
export class UITask extends UIXMLInterfacer {
  // Checks if the xml has id attribute
  // if it doesnt, it will add it
  // if it does, it will preserve it
  constructor({ uuid, xml }: { uuid: string; xml: string }) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    if (task[0].getAttribute("uuid") === null) {
      task[0].setAttribute("uuid", uuid);
    }
    super(new XMLSerializer().serializeToString(xmlDoc));
  }

  getText(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0].getAttribute("name") || "";
  }

  getUUID(): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const task = xmlDoc.getElementsByTagName("Task");
    return task[0].getAttribute("uuid") || "";
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
    const uuid = this.getUUID();
    return `<Task name="${text}" uuid="${uuid}" />`;
  }
}

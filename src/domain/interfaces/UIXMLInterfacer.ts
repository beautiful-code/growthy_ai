interface UIXMLInterface {
  _xml: string;

  // Serialize the object to XML
  /*
  getXML(): string;

  setXML(xml: string): void;
  */

  getUIStatelessXML(): string;

  // Deserialize the object from XML
  getObject(xml: string): UIXMLInterface;
}

export class UIXMLInterfacer implements UIXMLInterface {
  _xml: string;

  constructor(xml: string) {
    this._xml = xml;
  }

  /*
  // Serialize the object to XML
  getXML(): string {
    return this._xml;
  }

  setXML(xml: string): void {
    this._xml = xml;
  }
  */

  getUIStatelessXML(): string {
    throw new Error("getUIStatelessXML not implemented.");
  }

  // Deserialize the object from XML
  getObject(_xml: string): UIXMLInterface {
    throw new Error("getObject not implemented.");
  }
}

interface UIXMLInterface {
  _xml: string;

  getUIStatelessXML(): string;

}

export class UIXMLInterfacer implements UIXMLInterface {
  [key: string]: any;

  _xml: string;

  constructor(xml: string) {
    this._xml = xml;
  }

  getUIStatelessXML(): string {
    throw new Error("getUIStatelessXML not implemented.");
  }

}

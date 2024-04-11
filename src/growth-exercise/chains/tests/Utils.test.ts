import { getXMLStringFromMarkdown } from "../utils";

describe("getXMLStringFromMarkdown", () => {
  it("should return the XML string from the given LLM string", () => {
    const llmString = "some text ```xml <Tag>Value</Tag>``` some more text";
    const xmlString = getXMLStringFromMarkdown(llmString);
    expect(xmlString).toEqual("<Tag>Value</Tag>");
  });

  it("should return the first XML string from the given LLM string", () => {
    const llmString = "some text ```xml <Tag>Value</Tag>``` some more text ```xml <Tag>Value 2</Tag>```";
    const xmlString = getXMLStringFromMarkdown(llmString);
    expect(xmlString).toEqual("<Tag>Value</Tag>");
  });

  it("should return an empty string if no XML string is found", () => {
    const llmString = "some text ```json { \"key\": \"value\" }``` some more text";
    const xmlString = getXMLStringFromMarkdown(llmString);
    expect(xmlString).toEqual("");
  });
});
export const getXMLStringFromMarkdown = (
  llmString: string
) => {
  // Returns the first XML string from the given llmString Markdown string
  // Ex Input: 'some text ```xml <Tag>Value</Tag>``` some more text' should return '<Tag>Value</Tag>'
  const xmlRegex = /```xml(.*?)```/s;
  const match = xmlRegex.exec(llmString);
  return match ? match[1].trim() : "";
}
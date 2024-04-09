import "@testing-library/jest-dom";

import "../jest.d.ts";

import xml2js from "xml2js";

// Convert XML to JS Object Async
const parseXmlAsync = (
  xml: string,
  options: xml2js.OptionsV2
): Promise<any> => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

function toAnsiRed(text: string): string {
  return `\x1b[31m${text}\x1b[0m`; // Red
}

function toAnsiGreen(text: string): string {
  return `\x1b[32m${text}\x1b[0m`; // Green
}

expect.extend({
  async toEqualXml(receivedXml, expectedXml) {
    const parserOptions = {
      ignoreAttrs: false,
      trim: true,
      normalize: true,
    };
    try {
      const [receivedObj, expectedObj] = await Promise.all([
        parseXmlAsync(receivedXml, parserOptions),
        parseXmlAsync(expectedXml, parserOptions),
      ]);

      const pass = this.equals(receivedObj, expectedObj);

      if (pass) {
        return {
          message: () => `expected XML not to be equivalent`,
          pass: true,
        };
      } else {
        const receivedFormatted = toAnsiRed(receivedXml); // Format 'got' in red
        const expectedFormatted = toAnsiGreen(expectedXml); // Format 'want' in green

        // Constructing the diff message with color codes
        const diffMessage = [
          `Differences found:`,
          `Want (expected): ${expectedFormatted}`,
          `Got (received): ${receivedFormatted}`,
        ].join("\n");

        return {
          message: () => diffMessage,
          pass: false,
        };
      }
    } catch (error: any) {
      // Handle any parsing or comparison errors gracefully
      return {
        message: () => `Error during XML comparison: ${error.message}`,
        pass: false,
      };
    }
  },
});

import {
  BlogArticle as TBlogArticle,
  Section,
  TGrowthExercise,
  Task,
} from "types";
import { Node } from "domain/node/Node";

export class BlogArticle {
  title: string;
  sections: Section[];

  /**
   * Initializes a new instance of the BlogArticle class using an idea and a list of nodes.
   * @param growthExercise An object representing the blog article's growth exercise.
   * @param nodes An array of Node objects to be transformed into sections of the blog article.
   */
  constructor(growthExercise: TGrowthExercise, nodes: Node[]) {
    this.title = growthExercise.title;
    this.sections = nodes
      .filter((node) => node.parent_id === null)
      .map((node) => {
        const sectionName = node.text;
        const tasks = nodes
          .filter((childNode) => childNode.parent_id === node.id)
          .map((childNode) => ({
            text: childNode.text,
            is_task: childNode.is_task,
            indentation_level: 1,
            notes: childNode.notes,
            locked: childNode.locked,
            content: childNode.content,
          }));
        return { name: sectionName, tasks };
      });
  }

  /**
   * Builds an XML string representation of this BlogArticle instance.
   * @returns An XML string representing this BlogArticle instance.
   */
  buildBlogArticleXml(): string {
    let xml = `<BlogArticle>\n`;
    xml += `  <Title name="${this.escapeXML(this.title)}" />\n`;

    this.sections.forEach((section) => {
      xml += `  <Section name="${this.escapeXML(section.name)}">\n`;

      section.tasks.forEach((task) => {
        xml += `    <Task name="${this.escapeXML(task.text)}"`;
        xml += ` is_task="${task.is_task}"`;
        xml += ` indentation_level="${task.indentation_level}"`;
        xml += ` locked="${task.locked || false}"`;

        if (task.notes || task.content) {
          xml += `>\n      `;
          if (task.notes) {
            xml += `<Notes><![CDATA[${task.notes}]]></Notes>\n      `;
          }
          if (task.content) {
            xml += `<Content><![CDATA[${task.content}]]></Content>\n      `;
          }
          xml += `    </Task>\n`;
        } else {
          xml += " />\n";
        }
      });

      xml += `  </Section>\n`;
    });

    xml += `</BlogArticle>`;
    return xml;
  }

  static extractContentBetweenTagsForParsing(
    xml: string,
    tagName: string
  ): string[] {
    const regex = new RegExp(`<${tagName}.*?>(.*?)</${tagName}>`, "gs");
    const matches = xml.matchAll(regex);
    return Array.from(matches, (m) => m[1]);
  }

  static getAttributeValue(tag: string, attributeName: string): string | null {
    const regex = new RegExp(`${attributeName}="(.*?)"`);
    const match = tag.match(regex);
    return match ? match[1] : null;
  }

  static parseBlogArticle(xml: string): TBlogArticle {
    // Extracting title
    const titleTagMatch = xml.match(/<Title.*?\/>/);
    const title = titleTagMatch
      ? BlogArticle.getAttributeValue(titleTagMatch[0], "name") || ""
      : "";

    // Extracting sections
    const sectionMatches = xml.matchAll(
      /<Section name="(.*?)">(.*?)<\/Section>/gs
    );
    const sections: Section[] = Array.from(sectionMatches).map((match) => {
      const name = match[1];
      const sectionXml = match[2];
      const tasks: Task[] = [];

      // Regex to match Task elements, including their opening tag with attributes
      const taskRegex = /<Task\s+([^>]+?)(?:>([\s\S]*?)<\/Task>|\/>)/g;
      let taskMatch;
      while ((taskMatch = taskRegex.exec(sectionXml)) !== null) {
        // Extracting attributes from the Task opening tag
        const taskAttributesString = taskMatch[1];
        const taskContentXml = taskMatch[2];
        const taskAttributes =
          BlogArticle.parseAttributes(taskAttributesString);

        const taskName = taskAttributes.name || "";
        const isTask = taskAttributes.is_task === "true";
        const indentationLevel = parseInt(
          taskAttributes.indentation_level || "0",
          10
        );

        // Extracting content within CDATA
        let contentMatch = taskContentXml?.match(
          /<Content><!\[CDATA\[(.*?)\]\]><\/Content>/s
        );
        let content = contentMatch ? contentMatch[1] : "";

        tasks.push({
          text: taskName,
          is_task: isTask,
          indentation_level: indentationLevel,
          content: content,
        });
      }

      return { name, tasks };
    });

    return { title, sections };
  }

  // Method to parse attributes from a tag string
  static parseAttributes(attributesString: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    const regex = /(\w+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = regex.exec(attributesString)) !== null) {
      attributes[match[1]] = match[2];
    }
    return attributes;
  }

  /**
   * Escapes XML special characters in a given string.
   * @param str The string to escape.
   * @returns The escaped string.
   */
  private escapeXML(str: string): string {
    return str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }
}

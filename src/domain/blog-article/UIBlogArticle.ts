import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";
import { TSectionV2, TaskV2 } from "types";

/**
 * UIBlogArticle class has a blog article xml that was generated from open ai and it has the following structure:
 * <BlogArticle>
  <Title name="Embarking on the Journey of Sanskrit: A Personal Odyssey" />
  <Outline>
    <Section name="Introduction to My Sanskrit Journey">
      <Task name="Share personal background" />
      <Task name="Explain motivations for learning Sanskrit" />
    </Section>
    <Section name="Discovering The Sanskrit Channel">
      <Task name="Describe how I found The Sanskrit Channel" />
      <Task name="Discuss resources and content available on The Sanskrit Channel" />
    </Section>
    <Section name="My Daily Sanskrit Learning Routine">     
      <Task name="Outline daily learning schedule" />
      <Task name="Discuss time management strategies for learning" />
      <Task name="Describe various learning methods used" />
      <Task name="Share experience with interactive exercises and practices" />
    </Section>
    <Section name="Reflections and Impressions">
      <Task name="Share initial impressions of learning Sanskrit" />
      <Task name="Discuss challenges faced and how they were overcome" />
    </Section>
  </Outline>
</BlogArticle>
 */

export class UIBlogArticle extends UIXMLInterfacer {
  getTitle = (): string | null => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const title = xmlDoc.getElementsByTagName("Title")[0].getAttribute("name");
    return title;
  };

  getSections = (): TSectionV2[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const sections = xmlDoc.getElementsByTagName("Section");
    const sectionsArray: TSectionV2[] = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionName = section.getAttribute("name");
      const tasks = section.getElementsByTagName("Task");
      const tasksArray: TaskV2[] = [];
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        const taskName = task.getAttribute("name");
        tasksArray.push({
          text: taskName || "",
          is_action_item: true,
        });
      }
      sectionsArray.push({
        title: sectionName || "",
        tasks: tasksArray,
      });
    }
    return sectionsArray;
  };

  getStatelessXML(): string {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    let xmlString = `<BlogArticle>
    <Title name="${title}" />
    <Outline>`;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      xmlString += `<Section name="${section.title}">`;
      for (let j = 0; j < section.tasks.length; j++) {
        const task = section.tasks[j];
        xmlString += `<Task name="${task.text}" />`;
      }
      xmlString += `</Section>`;
    }
    xmlString += `</Outline>
</BlogArticle>`;
    return xmlString;
  }

  // Deserialize the object from XML
  getObject(xml: string): UIBlogArticle {
    this._xml = xml;
    return this;
  }
}

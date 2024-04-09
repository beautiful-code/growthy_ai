import { SectionV2, TaskV2 } from "types";

/**
 * BlogArticle class has a blog article xml that was generated from open ai and it has the following structure:
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
      <SubSection name="Setting a Schedule">
        <Task name="Outline daily learning schedule" />
        <Task name="Discuss time management strategies for learning" />
      </SubSection>
      <SubSection name="Learning Methods">
        <Task name="Describe various learning methods used" />
        <Task name="Share experience with interactive exercises and practices" />
      </SubSection>
    </Section>
    <Section name="Reflections and Impressions">
      <Task name="Share initial impressions of learning Sanskrit" />
      <Task name="Discuss challenges faced and how they were overcome" />
    </Section>
  </Outline>
</BlogArticle>
 */

export class BlogArticle {
  _blogArticleXml: string;

  constructor(xmlString: string) {
    this._blogArticleXml = xmlString;
  }

  get blogArticleXml(): string {
    return this._blogArticleXml;
  }

  set blogArticleXml(xmlString: string) {
    this._blogArticleXml = xmlString;
  }

  // Removes all is_expanded attributes in sections
  getStatelessBlogArticleXml(): string {
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

  // Parses the blog article xml and returns the title
  getTitle = (): string | null => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._blogArticleXml, "text/xml");
    const title = xmlDoc.getElementsByTagName("Title")[0].getAttribute("name");
    return title;
  };

  // Parses the blog article xml and returns the sections
  getSections = (): SectionV2[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._blogArticleXml, "text/xml");
    const sections = xmlDoc.getElementsByTagName("Section");
    const sectionsArray: SectionV2[] = [];
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

  static createBlogArticleXml = (
    title: string,
    sections: SectionV2[]
  ): string => {
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
  };

  addSection = (section: SectionV2): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections.push(section);
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };

  updateSection = (sectionIndex: number, updatedSection: SectionV2): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections[sectionIndex] = updatedSection;
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };

  deleteSection = (sectionIndex: number): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections.splice(sectionIndex, 1);
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };

  addTask = (sectionIndex: number, task: TaskV2): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections[sectionIndex].tasks.push(task);
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };

  updateTask = (
    sectionIndex: number,
    taskIndex: number,
    updatedTask: TaskV2
  ): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections[sectionIndex].tasks[taskIndex] = updatedTask;
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };

  deleteTask = (sectionIndex: number, taskIndex: number): void => {
    const title = this.getTitle() || "";
    const sections = this.getSections();

    sections[sectionIndex].tasks.splice(taskIndex, 1);
    this._blogArticleXml = BlogArticle.createBlogArticleXml(title, sections);
  };
}

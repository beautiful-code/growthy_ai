import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";
import { UIOutline } from "domain/common/UIOutline";

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
  getTitle(): string | null {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const title = xmlDoc.getElementsByTagName("Title")[0].getAttribute("name");
    return title;
  }

  updateTitle(title: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const titleNode = xmlDoc.getElementsByTagName("Title")[0];
    titleNode.setAttribute("name", title);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getOutline(): UIOutline {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const outline = xmlDoc.getElementsByTagName("Outline")[0];
    return new UIOutline(new XMLSerializer().serializeToString(outline));
  }

  updateOutline(outline: UIOutline): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const blogArticle = xmlDoc.getElementsByTagName("BlogArticle");
    const outlineXML = parser.parseFromString(outline._xml, "text/xml");
    const outlineNode = xmlDoc.importNode(
      outlineXML.getElementsByTagName("Outline")[0],
      true
    );
    blogArticle[0].replaceChild(outlineNode, blogArticle[0].children[1]);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  getUIStatelessXML(): string {
    const title = this.getTitle() || "";
    const outline = this.getOutline();

    let xmlString = `<BlogArticle>
                      <Title name="${title}" />`;
    xmlString += outline.getUIStatelessXML();
    xmlString += `</BlogArticle>`;
    return xmlString;
  }
}

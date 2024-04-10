import { UIXMLInterfacer } from "domain/interfaces/UIXMLInterfacer";
import { UISection } from "./UISection";

/**
 * UIOutline class has a outline xml and it has the following structure:
 *
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
 */

export class UIOutline extends UIXMLInterfacer {
  getSections = (): UISection[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const sections = xmlDoc.getElementsByTagName("Section");
    return Array.from(sections).map(
      (section) => new UISection(new XMLSerializer().serializeToString(section))
    );
  };

  updateSection(sectionIndex: number, section: UISection): void {
    const sections = this.getSections();
    sections[sectionIndex] = section;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._xml, "text/xml");
    const outline = xmlDoc.getElementsByTagName("Outline");
    const sectionXML = parser.parseFromString(section._xml, "text/xml");
    const sectionNode = xmlDoc.importNode(
      sectionXML.getElementsByTagName("Section")[0],
      true
    );
    outline[0].replaceChild(sectionNode, outline[0].children[sectionIndex]);
    this._xml = new XMLSerializer().serializeToString(xmlDoc);
  }

  expandAllSections(): void {
    const sections = this.getSections();
    sections.forEach((section, index) => {
      section.expandSection();
      this.updateSection(index, section);
    });
    let updatedXML = `<Outline>`;
    sections.forEach((section) => {
      updatedXML += section._xml;
    });
    updatedXML += `</Outline>`;
    this._xml = updatedXML;
  }

  collapseAllSections(): void {
    const sections = this.getSections();
    sections.forEach((section, index) => {
      section.collapseSection();
      this.updateSection(index, section);
    });
    let updatedXML = `<Outline>`;
    sections.forEach((section) => {
      updatedXML += section._xml;
    });
    updatedXML += `</Outline>`;
    this._xml = updatedXML;
  }

  getExpandesSectionIndices(): number[] {
    const sections = this.getSections();
    return sections.reduce((result, section, index) => {
      if (section.getIsExpanded()) {
        result.push(index);
      }
      return result;
    }, [] as number[]);
  }

  getUIStatelessXML(): string {
    const sections = this.getSections();
    let xmlString = `<Outline>`;
    sections.forEach((section) => {
      xmlString += section.getUIStatelessXML();
    });
    xmlString += `</Outline>`;
    return xmlString;
  }
}

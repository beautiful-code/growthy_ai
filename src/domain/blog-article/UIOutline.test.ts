import { UIOutline } from "./UIOutline";

describe("UIOutline", () => {
  it("should construct a UIOutline", () => {
    const xml = `<Outline>
            <Section name="Section 1">
                <Task name="Task 1" />
                <Task name="Task 2" />
            </Section>
        </Outline>`;

    const outline = new UIOutline(xml);
    expect(outline).toBeDefined();
    expect(outline.getUIStatelessXML()).toEqualXml(xml);
  });

  it("should get the sections of the outline", () => {
    const xml = `<Outline>
            <Section name="Section 1">
                <Task name="Task 1" />
                <Task name="Task 2" />
            </Section>
        </Outline>`;

    const outline = new UIOutline(xml);
    const sections = outline.getSections();
    expect(sections.length).toEqual(1);
    expect(sections[0].getSectionName()).toEqual("Section 1");
    expect(sections[0].getUITasks().length).toEqual(2);
    expect(sections[0].getUITasks()[0].getText()).toEqual("Task 1");
  });

  it("should expand all sections", () => {
    const xml = `<Outline>
            <Section name="Section 1" expanded="false">
                <Task name="Task 1" />
                <Task name="Task 2" />
            </Section>
            <Section name="Section 2" expanded="false">
                <Task name="Task 3" />
                <Task name="Task 4" />
            </Section>
        </Outline>`;

    const outline = new UIOutline(xml);
    outline.expandAllSections();
    expect(outline.getSections()[0].getIsExpanded()).toEqual(true);
    expect(outline.getSections()[1].getIsExpanded()).toEqual(true);
  });

  it("should collapse all sections", () => {
    const xml = `<Outline>
            <Section name="Section 1" expanded="true">
                <Task name="Task 1" />
                <Task name="Task 2" />
            </Section>
            <Section name="Section 2" expanded="true">
                <Task name="Task 3" />
                <Task name="Task 4" />
            </Section>
        </Outline>`;

    const outline = new UIOutline(xml);
    outline.collapseAllSections();
    expect(outline.getSections()[0].getIsExpanded()).toEqual(false);
    expect(outline.getSections()[1].getIsExpanded()).toEqual(false);
  });

  it("should return expanded section indices", () => {
    const xml = `<Outline>
            <Section name="Section 1" expanded="true">
                <Task name="Task 1" />
                <Task name="Task 2" />
            </Section>
            <Section name="Section 2" expanded="false">
                <Task name="Task 3" />
                <Task name="Task 4" />
            </Section>
        </Outline>`;

    const outline = new UIOutline(xml);
    const expandedIndices = outline.getExpandesSectionIndices();
    expect(expandedIndices).toEqual([0]);
  });
});

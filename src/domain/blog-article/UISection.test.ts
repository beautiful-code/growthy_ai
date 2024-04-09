import { UISection } from "./UISection";
import { UITask } from "./UITask";

describe("UISection", () => {
  it("should get constucted with a xml string", () => {
    const section = new UISection(`<Section name='section1'>
    <Task name='task1' />
    </Section>
    `);
    expect(section).toBeDefined();
    expect(section.getSectionName()).toBe("section1");
    expect(section.getUITasks()).toHaveLength(1);
    expect(section.getUITasks()[0]._xml).toBe('<Task name="task1"/>');
  });

  it("should update section name", () => {
    const section = new UISection(`<Section name='section1'>
        <Task name='task1' />
        </Section>
        `);
    section.updateSectionName("section2");
    expect(section.getSectionName()).toBe("section2");
    expect(section.getUIStatelessXML()).toBe(
      `<Section name="section2"><Task name="task1" /></Section>`
    );
  });

  it("should add a task", () => {
    const section = new UISection(`<Section name='section1'>
            <Task name='task1' />
            </Section>
            `);

    section.addTask(new UITask('<Task name="task2" />'));
    expect(section.getUITasks()).toHaveLength(2);
    expect(section.getUIStatelessXML()).toBe(
      `<Section name="section1"><Task name="task1" />
<Task name="task2" /></Section>`
    );
  });

  it("should expand section", () => {
    const section = new UISection(`<Section name='section1'>
            <Task name='task1' />
            </Section>
            `);

    section.expandSection();
    expect(section.getIsExpanded()).toBe(true);
  });

  it("should collapse section", () => {
    const section = new UISection(`<Section name='section1'>
              <Task name='task1' />
              </Section>
              `);

    section.collapseSection();
    expect(section.getIsExpanded()).toBe(false);
  });
});

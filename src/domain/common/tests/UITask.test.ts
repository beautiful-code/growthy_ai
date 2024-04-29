import { UITask } from "domain/common/UITask";

describe("UITask", () => {
  it("should get constucted with a xml string", () => {
    const task = new UITask({
      uuid: "1",
      xml: "<Task name='task1' />",
    });
    console.log(task);
    expect(task).toBeDefined();
    expect(task.getText()).toBe("task1");
    expect(task.getChecked()).toBe(false);
  });

  it("should update text", () => {
    const task = new UITask({
      uuid: "1",
      xml: "<Task name='task1' />",
    });
    task.updateText("task2");
    expect(task.getText()).toBe("task2");
    expect(task.getUIStatelessXML()).toBe(
      '<Task name="task2" uuid="1" checked="false" />'
    );
    expect(task._xml).toBe('<Task name="task2" uuid="1"/>');
  });

  it("should get constucted with a xml string with checked", () => {
    const task = new UITask({
      uuid: "1",
      xml: "<Task name='task1' checked='true' />",
    });
    expect(task).toBeDefined();
    expect(task.getText()).toBe("task1");
    expect(task.getChecked()).toBe(true);
  });

  describe("when checked is updated", () => {
    it("the xml string should have checked attribute set to true", () => {
      const task = new UITask({
        uuid: "1",
        xml: "<Task name='task1' />",
      });
      task.updateChecked(true);
      expect(task._xml).toBe('<Task name="task1" uuid="1" checked="true"/>');
      expect(task.getUIStatelessXML()).toBe(
        '<Task name="task1" uuid="1" checked="true" />'
      );
    });
  });

  it("should return if it is checked or not", () => {
    const task = new UITask({
      uuid: "1",
      xml: "<Task name='task1' checked='true' />",
    });
    expect(task.getChecked()).toBe(true);
  });
});

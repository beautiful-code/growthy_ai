import { NodeForRender } from "./NodeForRender";

describe("NodeForRender class tests", () => {
  function createTestNode(id: string | null, children = []) {
    return new NodeForRender({
      id,
      text: "Node",
      parent_id: null,
      rel_order: 0,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
      children,
    });
  }

  test("flattenTree should return a flat array of a simple tree", () => {
    const root = createTestNode("root");
    const child1 = createTestNode("child1");
    const child2 = createTestNode("child2");
    root.children.push(child1, child2);

    const flatArray = NodeForRender.flattenTree(root);
    expect(flatArray).toEqual([root, child1, child2]);
  });

  test("flattenTree should handle deep nested structures", () => {
    const root = createTestNode("root");
    const child1 = createTestNode("child1");
    const child2 = createTestNode("child2");
    const grandChild = createTestNode("grandChild");
    child1.children.push(grandChild);
    root.children.push(child1, child2);

    const flatArray = NodeForRender.flattenTree(root);
    expect(flatArray).toEqual([root, child1, grandChild, child2]);
  });

  test("flattenTree should return an array with only the root node for a tree with no children", () => {
    const root = createTestNode("root");
    const flatArray = NodeForRender.flattenTree(root);
    expect(flatArray).toEqual([root]);
  });

  test("flattenTree should handle an empty tree", () => {
    const root = createTestNode(null);
    const flatArray = NodeForRender.flattenTree(root);
    expect(flatArray).toEqual([root]);
  });

  // Additional tests can be added as needed
});

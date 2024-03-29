import { Node } from "./Node"; // Adjust the import path based on your project structure

describe("Node class tests", () => {
  let allNodes: Node[];

  beforeEach(() => {
    allNodes = [
      new Node({
        id: null,
        text: "Root",
        parent_id: null,
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      }),
      new Node({
        id: "node1",
        text: "Node 1",
        parent_id: null,
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      }),
      new Node({
        id: "node2",
        text: "Node 2",
        parent_id: null,
        rel_order: 1,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      }),
      new Node({
        id: "node3",
        text: "Node 3",
        parent_id: "node1",
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      }),
      new Node({
        id: "node4",
        text: "Node 4",
        parent_id: "node1",
        rel_order: 1,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      }),

      // Add more nodes as necessary for testing
    ];
  });

  describe("Addition of nodes", () => {
    test("should correctly add a child node to the specified parent", () => {
      const parentNode = allNodes.find((node) => node.id === "node1");
      const newChildId = "node5";

      if (!parentNode) {
        throw new Error("Test setup error: parentNode is null");
      }

      const addedChild = parentNode.addChild({
        id: newChildId,
        text: "Node 5",
        atIndex: 2,
        allNodes,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });

      expect(addedChild).toBeDefined();
      expect(addedChild?.parent_id).toBe(parentNode.id);
      expect(addedChild?.rel_order).toBe(2);
    });

    test("should accurately calculate the relative order (relOrder) for the new node", () => {
      const parentNode = allNodes.find((node) => node.id === "node1");
      const newChildId = "node6";

      if (!parentNode) {
        throw new Error("Test setup error: parentNode is null");
      }

      const addedChild = parentNode.addChild({
        id: newChildId,
        text: "Node 6",
        atIndex: 2,
        allNodes,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });

      expect(addedChild).toBeDefined();
      expect(addedChild?.rel_order).toBe(2);
      expect(addedChild.parent_id).toBe("node1");
    });
  });

  describe("Indentation of Nodes", () => {
    test("should successfully indent a node, making it a child of its immediate previous sibling", () => {
      const nodeToIndent = allNodes.find((node) => node.id === "node4");
      const previousSibling = allNodes.find((node) => node.id === "node3");

      if (!nodeToIndent || !previousSibling) {
        throw new Error(
          "Test setup error: nodeToIndent or previousSibling is null"
        );
      }

      previousSibling.indent(nodeToIndent, allNodes);

      expect(nodeToIndent.parent_id).toBe(previousSibling.id);
      expect(nodeToIndent.rel_order).toBe(
        previousSibling.getChildren(allNodes).length
      );
    });
  });

  describe("Outdentation of Nodes", () => {
    test("should properly outdent a node, elevating it to the root level", () => {
      const nodeToOutdent = allNodes.find((node) => node.id === "node2");
      const root = allNodes.find((node) => node.id === null);

      if (!nodeToOutdent || !root) {
        throw new Error("Test setup error: nodeToOutdent or root is null");
      }

      root.outdent(nodeToOutdent, 1, allNodes);

      expect(nodeToOutdent.parent_id).toBe(null);
      expect(nodeToOutdent.rel_order).toBe(1); // Assuming it's placed at root level at position 1
    });

    test("should effectively make a grandchild node a direct child of the grandparent", () => {
      const grandChild = allNodes.find((node) => node.id === "node3");
      const grandParent = allNodes.find((node) => node.id === null);

      if (!grandChild || !grandParent) {
        throw new Error("Test setup error: grandChild or grandParent is null");
      }

      const updatedGrandChild = grandParent.outdent(grandChild, 0, allNodes);

      expect(updatedGrandChild.parent_id).toBe(grandParent.id);
      expect(updatedGrandChild.rel_order).toBe(-1);
    });
  });
});

import { Node } from "domain/node/Node";
import { UITree } from "domain/ui-tree/UITree";

// Helper function to create a test UITree instance
function createTestTree(): UITree {
  /**
   *  root 0
   *    node1 0
   *      node3 0
   *      node4 1
   *      node5 2
   *    node2 1
   *    node6 2
   *      node8 0
   *      node9 1
   *       node10 0
   *    node7 3
   */
  const nodes = [
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
    new Node({
      id: "node5",
      text: "Node 5",
      parent_id: "node1",
      rel_order: 2,
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
      id: "node6",
      text: "Node 6",
      parent_id: null,
      rel_order: 2,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
    }),
    new Node({
      id: "node8",
      text: "Node 8",
      parent_id: "node6",
      rel_order: 0,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
    }),
    new Node({
      id: "node9",
      text: "Node 9",
      parent_id: "node6",
      rel_order: 1,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
    }),
    new Node({
      id: "node10",
      text: "Node 10",
      parent_id: "node9",
      rel_order: 0,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
    }),
    new Node({
      id: "node7",
      text: "Node 7",
      parent_id: null,
      rel_order: 3,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
    }),
    // Add more nodes as necessary for testing
  ];
  return new UITree(nodes);
}

describe("UITree class tests", () => {
  let tree: UITree;
  beforeEach(() => {
    tree = createTestTree();
  });

  describe("Adding New Nodes", () => {
    test("should correctly add new nodes to the root", () => {
      tree.addNode({
        id: "node8",
        text: "Node 8",
        parent_id: null,
        atIndex: 4,
        is_task: false,
        growth_exercise_id: "",
      });

      expect(tree.getNodes().some((node) => node.id === "node8")).toBeTruthy();
    });

    test("should correctly add new nodes to non root nodes", () => {
      tree.addNode({
        id: "node9",
        text: "Node 9",
        parent_id: "node1",
        atIndex: 3,
        is_task: false,
        growth_exercise_id: "",
      });

      expect(tree.getNodes().some((node) => node.id === "node9")).toBeTruthy();
    });
  });

  describe("Removing Nodes", () => {
    test("should remove nodes from the root and update the selected bullet ID", () => {
      tree.setSelectedBulletId("node1");
      const { deletedNode } = tree.removeNode("node1");

      expect(deletedNode).toBeTruthy();
      expect(deletedNode?.id).toBe("node1");
      expect(tree.getSelectedBulletId()).not.toBe("node1");
      expect(tree.getSelectedBulletId()).toBe("node3");
    });

    test("should remove child nodes and update the selected bullet ID", () => {
      tree.setSelectedBulletId("node4");
      const { deletedNode } = tree.removeNode("node4");

      expect(deletedNode).toBeTruthy();
      expect(deletedNode?.id).toBe("node4");
      expect(tree.getSelectedBulletId()).not.toBe("node4");
      expect(tree.getSelectedBulletId()).toBe("node3");
    });

    test("should remove nested nodes and update the selected bullet ID", () => {
      tree.setSelectedBulletId("node5");
      const { deletedNode } = tree.removeNode("node5");

      expect(deletedNode).toBeTruthy();
      expect(deletedNode?.id).toBe("node5");
      expect(tree.getSelectedBulletId()).not.toBe("node5");
      expect(tree.getSelectedBulletId()).toBe("node4");
    });
  });

  describe("when navigating upwards (pressing up arrow)", () => {
    test("if cursor was on the first child, it should move to parent", () => {
      tree.setSelectedBulletId("node3");
      tree.navigateUp();
      expect(tree.getSelectedBulletId()).toBe("node1");
    });

    test("if there is a previous sibling without children it should go to the previous sibling", () => {
      tree.setSelectedBulletId("node4");
      tree.navigateUp();
      expect(tree.getSelectedBulletId()).toBe("node3");
    });

    test("if there is a previous sibling with children it should go to the previous sibling's last descendent", () => {
      tree.setSelectedBulletId("node2");
      tree.navigateUp();
      expect(tree.getSelectedBulletId()).toBe("node5");
    });

    test("if there is a previous sibling with children it should go to the previous sibling's last descendent", () => {
      tree.setSelectedBulletId("node7");
      tree.navigateUp();
      expect(tree.getSelectedBulletId()).toBe("node10");
    });
  });

  describe("Navigation Downwards", () => {
    test("should navigate to the first child when available", () => {
      tree.setSelectedBulletId("node1");
      tree.navigateDown();
      expect(tree.getSelectedBulletId()).toBe("node3");
    });

    test("should navigate to the next sibling if no children are available", () => {
      tree.setSelectedBulletId("node4");
      tree.navigateDown();
      expect(tree.getSelectedBulletId()).toBe("node5");
    });

    test("should navigate to the next parent from the last descendant", () => {
      tree.setSelectedBulletId("node5");
      tree.navigateDown();
      expect(tree.getSelectedBulletId()).toBe("node2");
    });

    test("should navigate to the next parent from the first level without children", () => {
      tree.setSelectedBulletId("node2");
      tree.navigateDown();
      expect(tree.getSelectedBulletId()).toBe("node6");
    });

    test("should navigate to next ancestor if there are no more siblings", () => {
      tree.setSelectedBulletId("node10");
      tree.navigateDown();
      expect(tree.getSelectedBulletId()).toBe("node7");
    });
  });

  describe("Indenting Nodes", () => {
    test("should indent a node into its previous sibling", () => {
      tree.setSelectedBulletId("node2");
      tree.indentNode("node2");

      const node2 = tree.getNodes().find((node) => node.id === "node2");
      expect(node2?.parent_id).toBe("node1");
    });

    test("should not indent if it's a leaf node", () => {
      tree.setSelectedBulletId("node3");
      tree.indentNode("node3");

      const node3 = tree.getNodes().find((node) => node.id === "node3");
      expect(node3?.parent_id).toBe("node1");
    });

    test("should indent a node along with its children", () => {
      tree.setSelectedBulletId("node6");
      tree.indentNode("node6");

      const node6 = tree.getNodes().find((node) => node.id === "node6");
      expect(node6?.parent_id).toBe("node2");
      const node9 = tree.getNodes().find((node) => node.id === "node9");
      expect(node9?.parent_id).toBe("node6");
    });
  });

  describe("Outdenting Nodes", () => {
    test("should correctly outdent a child node to root level", () => {
      tree.setSelectedBulletId("node3");
      const node3 = tree.outdentNode("node3");

      const node1 = tree.getNodes().find((node) => node.id === "node1");
      const node2 = tree.getNodes().find((node) => node.id === "node2");
      expect(node3?.parent_id).toBe(null);
      expect(node3?.rel_order).toBeLessThan(node2?.rel_order as number);
      expect(node3?.rel_order).toBeGreaterThan(node1?.rel_order as number);
    });

    test("should outdent a node to be a sibling of its parent", () => {
      tree.setSelectedBulletId("node4");
      const node4 = tree.outdentNode("node4");

      expect(node4?.parent_id).toBe(null);
    });
  });

  describe("Finding Last Descendant", () => {
    test("should accurately find the correct last descendant", () => {
      expect(tree.getLastDescendant("node1")).toBe("node5");
    });
  });

  describe("Replace Bullet", () => {
    test("should replace bullet and its children", () => {
      const newBullet = new Node({
        id: "node11",
        text: "Node 11",
        parent_id: null,
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });
      const newChild1 = new Node({
        id: "node12",
        text: "Node 12",
        parent_id: "node11",
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });
      const newChild2 = new Node({
        id: "node13",
        text: "Node 13",
        parent_id: "node11",
        rel_order: 1,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });
      const newChild3 = new Node({
        id: "node16",
        text: "Node 16",

        parent_id: "node11",
        rel_order: 2,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });
      const newSubChild1 = new Node({
        id: "node14",
        text: "Node 14",
        parent_id: "node12",
        rel_order: 0,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });
      const newSubChild2 = new Node({
        id: "node15",
        text: "Node 15",
        parent_id: "node12",
        rel_order: 1,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
      });

      const updatedNodes = [
        newBullet,
        newChild1,
        newChild2,
        newChild3,
        newSubChild1,
        newSubChild2,
      ];

      const { deletedNodes, addedNodes } = tree.replaceBullet(
        "node6",
        updatedNodes
      );

      // Check that the old nodes are gone
      expect(deletedNodes.some((node) => node.id === "node6")).toBeTruthy();
      expect(deletedNodes.some((node) => node.id === "node8")).toBeTruthy();
      expect(deletedNodes.some((node) => node.id === "node9")).toBeTruthy();
      expect(deletedNodes.some((node) => node.id === "node10")).toBeTruthy();

      // Check that the new nodes are there
      expect(addedNodes.some((node) => node.id === "node11")).toBeTruthy();
      expect(addedNodes.some((node) => node.id === "node12")).toBeTruthy();
      expect(addedNodes.some((node) => node.id === "node13")).toBeTruthy();
      expect(addedNodes.some((node) => node.id === "node14")).toBeTruthy();
      expect(addedNodes.some((node) => node.id === "node15")).toBeTruthy();
      expect(addedNodes.some((node) => node.id === "node16")).toBeTruthy();

      // Check that the new nodes have the correct parent
      expect(addedNodes.find((node) => node.id === "node11")?.parent_id).toBe(
        null
      );
      expect(addedNodes.find((node) => node.id === "node12")?.parent_id).toBe(
        "node11"
      );
      expect(addedNodes.find((node) => node.id === "node13")?.parent_id).toBe(
        "node11"
      );
      expect(addedNodes.find((node) => node.id === "node14")?.parent_id).toBe(
        "node12"
      );
      expect(addedNodes.find((node) => node.id === "node15")?.parent_id).toBe(
        "node12"
      );
      expect(addedNodes.find((node) => node.id === "node16")?.parent_id).toBe(
        "node11"
      );
    });
  });

  describe("Create Nodes From Sections", () => {
    let tree: UITree;

    beforeEach(() => {
      tree = createTestTree();
    });

    test("should correctly create nodes from sections", () => {
      const sections = [
        { name: "Section A", tasks: [] },
        {
          name: "Section B",
          tasks: [{ text: "Task B1", is_task: false, indentation_level: 1 }],
        },
        { name: "Section C", tasks: [] },
      ];

      tree.createNodesFromSections(sections);

      const nodes = tree.getNodes();
      expect(nodes.some((node) => node.text === "Section A")).toBeTruthy();
      expect(nodes.some((node) => node.text === "Task B1")).toBeTruthy();
      expect(nodes.some((node) => node.text === "Section C")).toBeTruthy();

      // Check the parent-child relationship
      const sectionB = nodes.find((node) => node.text === "Section B");
      const taskB1 = nodes.find((node) => node.text === "Task B1");
      expect(taskB1?.parent_id).toBe(sectionB?.id);
    });
  });

  describe("Tree To String", () => {
    // ... other tests remain unchanged ...

    it("should correctly represent a tree with sections and tasks", () => {
      const nodes = [
        new Node({
          id: "section1",
          text: "Section 1",
          parent_id: null,
          rel_order: 0,
          is_task: false,
          is_checked: false,
          growth_exercise_id: "",
        }),
        new Node({
          id: "task1",
          text: "Task 1",
          parent_id: "section1",
          rel_order: 0,
          is_task: true,
          is_checked: false,
          growth_exercise_id: "",
        }), // Action item under Section 1
        new Node({
          id: "section2",
          text: "Section 2",
          parent_id: null,
          rel_order: 1,
          is_task: false,
          is_checked: false,
          growth_exercise_id: "",
        }),
        new Node({
          id: "task2",
          text: "Task 2",
          parent_id: "section2",
          rel_order: 0,
          is_task: false,
          is_checked: false,
          growth_exercise_id: "",
        }), // Task under Section 2
      ];
      const tree = new UITree(nodes);
      const expectedString = "Section 1\n  [] Task 1\nSection 2\n  Task 2";
      expect(tree.treeToString()).toBe(expectedString);
    });
  });
});

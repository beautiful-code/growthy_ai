import { TNode } from "types";

/**
 * Node class
 * This class represents a single bullet point in the tree.
 * It is used to create the tree structure and to perform operations on the tree.
 */
export class Node {
  id: string | null;
  text: string;
  parent_id: string | null;
  rel_order: number;
  is_task: boolean;
  is_checked: boolean;
  growth_exercise_id: string;

  constructor({
    id,
    text,
    parent_id = null,
    rel_order = 0,
    is_task = false,
    is_checked = false,
    growth_exercise_id = "",
  }: {
    id: string | null;
    text: string;
    parent_id: string | null;
    rel_order: number;
    is_task: boolean;
    is_checked: boolean;
    growth_exercise_id: string;
  }) {
    this.id = id;
    this.text = text;
    this.parent_id = parent_id;
    this.rel_order = rel_order;
    this.is_task = is_task;
    this.is_checked = is_checked;
    this.growth_exercise_id = growth_exercise_id;
  }

  /**
   * Returns the children of the current node.
   */
  getChildren(allNodes: Node[]): Node[] {
    if (this.id === "") {
      return allNodes
        .filter((n) => n.parent_id === null)
        ?.sort((a, b) => a.rel_order - b.rel_order);
    }
    return allNodes
      .filter((n) => n.parent_id === this.id)
      ?.sort((a, b) => a.rel_order - b.rel_order);
  }

  /**
   * Adds a new child to the current node.
   * It calculates the relOrder based on the following rules:
   * 1. If the new node is the first child, get the minimum relOrder of the children and subtract 1
   * 2. If the new node is the last child, get the maximum relOrder of the children and add 1
   * 3. If the new node is in the middle, get the average of the relOrder of the previous and next nodes
   */
  addChild({
    id,
    text,
    atIndex,
    allNodes,
    is_task,
    is_checked,
    growth_exercise_id,
  }: {
    id: string | null;
    text: string;
    atIndex: number;
    allNodes: Node[];
    is_task: boolean;
    is_checked: boolean;
    growth_exercise_id: string;
  }): Node {
    const children = this.getChildren(allNodes)?.filter((n) => n.id !== null);
    let newRelOrder: number;

    if (atIndex === 0) {
      newRelOrder = children.length > 0 ? children[0].rel_order - 1 : 1; // Default to 1 if no children
    } else if (atIndex >= children.length) {
      newRelOrder =
        children.length > 0 ? children[children.length - 1].rel_order + 1 : 0;
    } else {
      newRelOrder =
        (children[atIndex - 1].rel_order + children[atIndex].rel_order) / 2;
    }

    const newNode = new Node({
      id,
      text,
      parent_id: this.id,
      rel_order: newRelOrder,
      is_task,
      is_checked,
      growth_exercise_id,
    });
    return newNode;
  }

  /**
   * Indents a node, making it a child of the current node
   * If the current node has no children, the new node will be the first child
   * If the current node has children, the new node will be the last child
   */
  indent(nodeToIndent: Node, allNodes: Node[]): Node {
    const children = this.getChildren(allNodes);

    nodeToIndent.parent_id = this.id;

    if (children.length === 0) {
      return this.addChild({
        id: nodeToIndent.id,
        text: nodeToIndent.text,
        atIndex: 0,
        allNodes,
        is_task: nodeToIndent.is_task,
        is_checked: nodeToIndent.is_checked,
        growth_exercise_id: nodeToIndent.growth_exercise_id,
      });
    } else {
      return this.addChild({
        id: nodeToIndent.id,
        text: nodeToIndent.text,
        atIndex: children.length,
        allNodes,
        is_task: nodeToIndent.is_task,
        is_checked: nodeToIndent.is_checked,
        growth_exercise_id: nodeToIndent.growth_exercise_id,
      });
    }
  }

  /**
   * Outdents a node, making it a sibling of the current node
   * This function runs on grandparent of a child node
   * It invokes the addChild function on the grandparent
   * The grandparent becomes the parent of the passed in grandChild
   */
  outdent(grandChild: Node, atIndex: number, allNodes: Node[]): Node {
    return this.addChild({
      id: grandChild.id,
      text: grandChild.text,
      atIndex,
      allNodes,
      is_task: grandChild.is_task,
      is_checked: grandChild.is_checked,
      growth_exercise_id: grandChild.growth_exercise_id,
    });
  }

  /**
   * Returns the ancestors of the current node
   */
  getAncestors(allNodes: Node[]): Node[] {
    const ancestors: Node[] = [];
    let parentId = this.parent_id;

    while (parentId !== null) {
      const parent = allNodes.find((n) => n.id === parentId);
      if (parent) {
        ancestors.push(parent);
        parentId = parent.parent_id;
      }
    }

    return ancestors;
  }

  /**
   * Returns the TNode object representation of the current node
   */
  toTNode(): TNode {
    return {
      id: this.id || "",
      text: this.text,
      parent_id: this.parent_id,
      rel_order: this.rel_order,
      is_task: this.is_task,
      is_checked: this.is_checked,
      growth_exercise_id: this.growth_exercise_id,
    };
  }
}

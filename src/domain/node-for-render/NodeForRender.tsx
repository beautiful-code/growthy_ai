import { TNode } from "types";
import { Node } from "domain/node/Node";

export class NodeForRender {
  id: string | null;
  parent_id: string | null;
  text: string;
  rel_order: number;
  is_task: boolean;
  is_checked: boolean;
  public pos_index: number = -1;
  growth_exercise_id: string;
  children: NodeForRender[];

  constructor({
    id,
    text,
    parent_id = null,
    rel_order = 0,
    is_task = false,
    is_checked = false,
    growth_exercise_id = "",
    children = [],
  }: {
    id: string | null;
    text: string;
    parent_id: string | null;
    rel_order: number;
    is_task: boolean;
    is_checked: boolean;
    growth_exercise_id: string;
    children: NodeForRender[];
  }) {
    this.id = id;
    this.text = text;
    this.parent_id = parent_id;
    this.rel_order = rel_order;
    this.is_task = is_task;
    this.is_checked = is_checked;
    this.children = children;
    this.growth_exercise_id = growth_exercise_id;
  }

  /**
   * Converts the tree structure into a flat array of nodes.
   *
   * @param {NodeForRender} node The node to start flattening from.
   * @param {NodeForRender[]} accumulator Accumulates the flat list of nodes.
   */
  static flattenTree(
    node: NodeForRender,
    accumulator: NodeForRender[] = []
  ): NodeForRender[] {
    accumulator.push(node);

    node.children.forEach((child) => {
      NodeForRender.flattenTree(child, accumulator);
    });

    return accumulator;
  }

  /**
   * Returns the TNode representation of this NodeForRender instance.
   */
  toTNode(): TNode {
    return {
      id: this.id || "",
      text: this.text,
      parent_id: this.parent_id || "",
      rel_order: this.rel_order,
      is_task: this.is_task,
      is_checked: this.is_checked,
      growth_exercise_id: this.growth_exercise_id,
    };
  }

  /**
   * Returns a Node object representation of this NodeForRender instance.
   */
  toNode(): Node {
    return new Node({
      id: this.id,
      text: this.text,
      parent_id: this.parent_id,
      rel_order: this.rel_order,
      is_task: this.is_task,
      is_checked: this.is_checked,
      growth_exercise_id: this.growth_exercise_id,
    });
  }
}

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
  content: string | null;
  locked: boolean;
  notes: string;

  constructor({
    id,
    text,
    parent_id = null,
    rel_order = 0,
    is_task = false,
    is_checked = false,
    growth_exercise_id = "",
    locked = false,
    content = "",
    notes = "",
    children = [],
  }: {
    id: string | null;
    text: string;
    parent_id: string | null;
    rel_order: number;
    is_task: boolean;
    is_checked: boolean;
    growth_exercise_id: string;
    locked: boolean;
    content: string;
    notes: string;
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
    this.content = content;
    this.notes = notes;
    this.locked = locked;
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
}

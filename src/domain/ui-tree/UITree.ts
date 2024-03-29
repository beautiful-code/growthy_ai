import { v4 as uuidv4 } from "uuid";
import { Node } from "domain/node/Node";
import { NodeForRender } from "domain/node-for-render/NodeForRender";

import { Section } from "types";

type TRemoveNodeResp = {
  deletedNode: Node | null;
  updatedNodes: Node[];
  selectedBulletId: string | null;
};

type TReplaceNodeResp = {
  deletedNodes: Node[];
  addedNodes: Node[];
  selectedBulletId: string | null;
};

/**
 * UITree class has bullet nodes and the selected bullet id
 *
 * It has the following methods that can be performed on it
 * addNode, removeNode, indent, outdent, navigateUp and navigateDown
 */
export class UITree {
  public nodes: Node[];
  public selectedBulletId: string | null;

  constructor(nodes: Node[], selectedBulletId: string | null = null) {
    this.nodes = nodes;
    this.selectedBulletId = selectedBulletId;
  }

  setSelectedBulletId(id: string | null) {
    this.selectedBulletId = id;
  }

  getSelectedBulletId(): string | null {
    return this.selectedBulletId;
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  /**
   * This function takes the id of a node and gives the last descendent from it
   *
   * Steps
   *  Get the children and recusivelly calls itself with the last child
   *  If there are no children the node id is returned
   *
   * Example - if the tree is as following
   * node1
   *  node2
   *  node3
   *    node4
   *    node5
   *
   * input node1, output node5
   */
  getLastDescendant(nodeId: string | null): string | null {
    const children = this.nodes.filter((node) => node.parent_id === nodeId);
    if (children.length === 0) {
      return nodeId;
    } else {
      // Get the last child and find its last descendant
      return this.getLastDescendant(children[children.length - 1].id);
    }
  }

  /**
   * This function takes a node id and gets the next sibling based on rel_order
   *
   * Steps
   *  Get children of the parent node
   *  Sort them based on rel_order
   *  Find index of current node
   *  Return the node in next index
   *
   * Example
   * node1
   *  node2
   *  node3
   *    node4
   *    node5
   * node6
   *
   * input node2, output node3
   * input node4, output node5
   * input node1, output node6
   */
  getNextSiblingId(nodeId: string): string | null {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return null; // Node not found

    // Get all siblings and sort them based on their relative order (rel_order)
    const siblings = this.nodes
      .filter((n) => n.parent_id === node.parent_id)
      .sort((a, b) => a.rel_order - b.rel_order);

    const nodeIndex = siblings.findIndex((n) => n.id === nodeId);

    if (nodeIndex >= 0 && nodeIndex < siblings.length - 1) {
      // Next sibling exists
      return siblings[nodeIndex + 1].id;
    } else {
      // No next sibling
      return null;
    }
  }

  /**
   * This function uses the selected bullet ID and gets the node above it and makes it the selected bullet
   *
   * Logic
   *  If the previous sibling doesnt have children go to the previous sibling
   *  If the previous sibling has children go to the last descendent of the previous sibling
   *  If it is the first child set the selected id as parent id
   *
   * Steps
   *  Get current node, its parent and siblings
   *  Get current node index
   *  Determine if there are previous sibling
   *  if the previos sibling has children return last descendent else return previous sibling's id
   *  else if no previous sibling return parent id
   */
  navigateUp(): string | null {
    if (!this.selectedBulletId) return null;

    // Get current node, its parent, its siblings and its index
    const currentNode = this.nodes.find(
      (node) => node.id === this.selectedBulletId
    );
    if (!currentNode || currentNode.id === null) {
      // Root node or no selection
      return null;
    }
    const parentNodeId = currentNode.parent_id;
    const siblings = this.nodes
      .filter((node) => node.id && node.parent_id === parentNodeId)
      .sort((a, b) => a.rel_order - b.rel_order);

    const currentIndex = siblings.findIndex(
      (node) => node.id === this.selectedBulletId
    );

    if (currentIndex > 0) {
      // If there are previous siblings, get previous sibling
      const previousSibling = siblings[currentIndex - 1];
      const previousSiblingChildren = this.nodes.filter(
        (node) => node.parent_id === previousSibling.id
      );

      // set selected bullet id as last descendent of previous sibling if there are children else previous sibling id
      this.selectedBulletId =
        previousSiblingChildren.length > 0
          ? this.getLastDescendant(
              previousSiblingChildren[previousSiblingChildren.length - 1].id
            )
          : previousSibling.id;
    } else if (currentIndex === 0) {
      // if it is the first child set the parent id
      this.selectedBulletId = parentNodeId;
    }

    return this.selectedBulletId;
  }

  /**
   * This function takes a node id and gets the next sibling or parent's sibling based on rel_order
   *
   * Steps
   *  Get the node, its parent and siblings
   *  Find the index of the node
   *  If there is a next sibling return its id
   *  else if there is a parent return the parent's sibling
   *  else return null
   *
   * Example
   * node1
   *  node2
   *  node3
   *    node4
   *    node5
   * node6
   *
   * input node2, output node3
   * input node4, output node5
   * input node6, output null
   */
  navigateToSiblingOrParent = (nodeId: string | null): string | null => {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return null;
    }

    const siblings = this.nodes
      .filter((n) => n.parent_id === node.parent_id)
      .sort((a, b) => a.rel_order - b.rel_order);
    const currentIndex = siblings.findIndex((n) => n.id === nodeId);

    if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1].id;
    } else {
      // If no next sibling, check for the parent's sibling
      return node.parent_id
        ? this.navigateToSiblingOrParent(node.parent_id)
        : null;
    }
  };

  /**
   * The function uses the selected bullet id, gets the node below it and makes it the selected bullet id
   *
   * Logic & steps
   *  Get the current node, its parents and siblings
   *  if it has children set the first child
   *  else find the current node index
   *  if it is not the last node set the next nodes id as selected bullet id
   *  else
   *    Get the siblings of parent
   *    Get next parent and set it as bullet id
   *    recursively call itself with parent id
   *
   */
  navigateDown(): string | null {
    if (!this.selectedBulletId) {
      return null;
    }

    const currentNode = this.nodes.find(
      (node) => node.id === this.selectedBulletId
    );
    if (!currentNode) {
      return null;
    }

    const children = this.nodes.filter(
      (node) => node.parent_id === this.selectedBulletId
    );
    if (children.length > 0) {
      // If there are children, set the first child
      this.selectedBulletId = children.sort(
        (a, b) => a.rel_order - b.rel_order
      )[0].id;
      return this.selectedBulletId;
    } else {
      // If no children, navigate to the sibling or up the tree
      this.selectedBulletId = this.navigateToSiblingOrParent(currentNode.id);
      return this.selectedBulletId;
    }
  }

  /**
   * This function takes all the required parameters gets the parent node and invokes the node's addChild method
   */
  addNode({
    id,
    text,
    parent_id,
    atIndex,
    is_task,
    growth_exercise_id,
  }: {
    id: string | null;
    text: string;
    parent_id: string | null;
    atIndex: number;
    is_task: boolean;
    growth_exercise_id: string;
  }): Node | null {
    const parentNode = this.nodes.find((node) => node.id === parent_id);

    if (!parentNode) {
      return null;
    }

    return parentNode.addChild({
      id,
      text,
      atIndex,
      allNodes: this.nodes,
      is_task,
      is_checked: false,
      growth_exercise_id,
    });
  }

  /**
   * This function gets a node id, removes that node and re assigns the childs parent id also navigate accordingly
   *
   * Steps
   *  Get all children and re-assign the parent
   *  Navigate up or down based on condition
   */
  removeNode(nodeId: string | null): TRemoveNodeResp {
    if (!nodeId) {
      return { deletedNode: null, updatedNodes: [], selectedBulletId: null };
    }
    const nodeToRemove = this.nodes.find((node) => node.id === nodeId);
    if (!nodeToRemove) {
      return { deletedNode: null, updatedNodes: [], selectedBulletId: null };
    }

    const parentNodeId = nodeToRemove.parent_id;

    // Get siblings and sort them by rel_order
    const siblings = this.nodes
      .filter((node) => node.id && node.parent_id === parentNodeId)
      .sort((a, b) => a.rel_order - b.rel_order);

    const currentIndex = siblings.findIndex((node) => node.id === nodeId);

    const updatedNodes: Node[] = [];
    // Reassign children of the removed node to its parent
    // TODO: use addChild here ??
    this.nodes.forEach((node, idx) => {
      if (node.parent_id === nodeId) {
        const updatedNode = this.addNode({
          id: node.id,
          text: node.text,
          parent_id: parentNodeId,
          atIndex: currentIndex + idx,
          is_task: node.is_task,
          growth_exercise_id: node.growth_exercise_id,
        });
        if (updatedNode && updatedNode.id) {
          updatedNodes.push(updatedNode);
        }
      }
    });

    if (this.selectedBulletId === nodeId) {
      if (currentIndex > 0 || parentNodeId !== null) {
        this.navigateUp();
      } else {
        this.navigateDown();
      }
    }
    // Remove the node
    const deletedNode = this.nodes.filter(
      (node) => node.id && node.id === nodeId
    )[0];

    return {
      deletedNode,
      updatedNodes,
      selectedBulletId: this.selectedBulletId,
    };
  }

  /**
   * Delete node
   *
   * takes the node id and recursively deletes all the child nodes and itself
   *  Get the children of the node
   *  Recursively delete the children
   *  Remove the node
   *
   * returns all the deleted nodes
   */
  deleteNode(nodeId: string | null): Node[] {
    if (!nodeId) {
      return [];
    }

    const deletedNodes = this._removeNodeAndChildren(nodeId);
    return deletedNodes;
  }

  /**
   * This function takes a node id and indents it
   *
   * Steps
   *  Get the node to indent, its siblings and sort them by rel_order
   *  Get the index of the node to indent
   *  If the node is not the first child of its parent
   *  else Get the previous sibling
   *  Indent the node to indent
   */
  indentNode(nodeId: string): Node | null {
    const nodeToIndent = this.nodes.find((node) => node.id === nodeId);
    if (!nodeToIndent || nodeToIndent.id === null) {
      // Node is at the root level or not found, can't indent
      return null;
    }

    // Find siblings and sort them by rel_order
    const siblings = this.nodes
      .filter((node) => node.parent_id === nodeToIndent.parent_id)
      .sort((a, b) => a.rel_order - b.rel_order);

    const nodeIndex = siblings.findIndex((node) => node.id === nodeId);

    if (nodeIndex > 0) {
      const previousSibling = siblings[nodeIndex - 1];
      return previousSibling.indent(nodeToIndent, this.nodes);
    }
    return null;
  }

  /**
   * This function takes a node id and outdents it
   *
   * Steps
   *  Get the node to outdent and its parent
   *  If the parent is null return
   *  Get the parent's siblings and sort them by rel_order
   *  Get the index of the node to outdent
   *  If the node is not the last child of its parent
   *  Get the next sibling
   *  Outdent the node to outdent
   */
  outdentNode(nodeId: string): Node | null {
    const node = this.nodes.find((node) => node.id === nodeId);
    if (!node || !node.parent_id) {
      return null;
    }

    const parentNode = this.nodes.find((n) => n.id === node.parent_id);
    if (!parentNode || !parentNode.id) {
      return null;
    }

    const grandParentNode = this.nodes.find(
      (node) => node.id === parentNode.parent_id
    );
    if (!grandParentNode) {
      return null;
    }

    const newSiblings = this.nodes
      .filter((node) => node.parent_id === grandParentNode.id)
      .sort((a, b) => a.rel_order - b.rel_order);
    const atIndex = newSiblings.findIndex(
      (sibling) => parentNode.rel_order <= sibling.rel_order
    );

    this.nodes = this.nodes.filter((node) => node.id !== nodeId);
    return grandParentNode.outdent(node, atIndex + 1, this.nodes);
  }

  _removeNodeAndChildren(nodeId: string): Node[] {
    let deletedNodes: Node[] = [];

    // Find children of the node
    const children = this.nodes.filter((node) => node.parent_id === nodeId);

    // Recursively remove children and collect deleted nodes
    children.forEach((child) => {
      if (child.id) {
        deletedNodes = deletedNodes.concat(
          this._removeNodeAndChildren(child.id)
        );
      }
    });
    // Find and remove the node itself, then add it to the deleted nodes list
    const nodeToRemove = this.nodes.find((node) => node.id === nodeId);
    if (nodeToRemove) {
      this.nodes = this.nodes.filter((node) => node.id !== nodeId);
      deletedNodes.push(nodeToRemove);
    }

    return deletedNodes;
  }
  /**
   * This function takes a node id and replaces it with new nodes
   * It is used when the user wants to replace a bullet with a list of bullets
   * It adds the new nodes, the newNodes contains one main parent node and its children
   * The main parent node will have the same parent_id and rel_order as the node to replace
   * The children will have their respective rel_order and parent_id
   *
   * Steps
   *   Get the node to replace
   *   Store the parent id and rel_order of the node to be removed
   *   Recursively delete the current children and finally the node to be removed
   *   Add the new parent node with the stored parent id and rel_order
   *   Recursively add the new children
   */
  replaceBullet(nodeIdToRemove: string, newNodes: Node[]): TReplaceNodeResp {
    const nodeToRemove = this.nodes.find((node) => node.id === nodeIdToRemove);
    if (!nodeToRemove || !newNodes[0].id) {
      return {
        deletedNodes: [],
        addedNodes: [],
        selectedBulletId: null,
      };
    }

    const parentId = nodeToRemove.parent_id;
    const rel_order = nodeToRemove.rel_order;

    // Remove the node and its children recursively
    const deletedNodes = this._removeNodeAndChildren(nodeIdToRemove);

    const addedNodes: Node[] = [];

    // Add new nodes
    for (let i = 0; i < newNodes.length; i++) {
      const newNode = newNodes[i];
      const id = newNode.id;
      const text = newNode.text;
      const isTask = newNode.is_task;
      const growthExercieId = newNode.growth_exercise_id;

      const newParentId = i === 0 ? parentId : newNodes[i].parent_id; // First new node takes the parent of the node to be replaced
      const newAtIndex = i === 0 ? rel_order : i; // First new node takes the rel_order of the node to be replaced

      // Add the node
      if (id) {
        const addedNode = this.addNode({
          id,
          text,
          parent_id: newParentId,
          atIndex: newAtIndex,
          is_task: isTask,
          growth_exercise_id: growthExercieId,
        });
        addedNodes.push(addedNode as Node);
        this.nodes.push(addedNode as Node);
      }
    }

    return {
      deletedNodes,
      addedNodes: addedNodes,
      selectedBulletId: this.selectedBulletId,
    };
  }

  static computePosIndex(node: NodeForRender, startIndex: number = -1): number {
    // starting with -1 because of root
    node.pos_index = startIndex;
    let currentIndex = startIndex;

    node.children.forEach((child) => {
      currentIndex = UITree.computePosIndex(child, currentIndex + 1);
    });

    return currentIndex; // Return the last index used
  }

  /**
   * This function takes a node id and builds a tree
   *
   * Logic
   *  Maintain a map with parent id as key and children as value
   *  Iterate through the nodes and add them to the map
   *  Iterate through the map and build the tree
   *  Return the tree
   */
  static buildTree(nodes: Node[]): NodeForRender {
    const root = new NodeForRender({
      id: "",
      text: "",
      parent_id: null,
      rel_order: 0,
      is_task: false,
      is_checked: false,
      growth_exercise_id: "",
      locked: false,
      content: "",
      notes: "",
      children: [],
    });

    // Map to store NodeForRender references by id
    const map: { [key: string]: NodeForRender } = { "": root };

    // First pass to create all nodes and store them in the map
    nodes.forEach((node) => {
      if (node.id) {
        map[node.id] = new NodeForRender({
          id: node.id,
          text: node.text,
          parent_id: node.parent_id,
          rel_order: node.rel_order,
          is_task: node.is_task,
          locked: node.locked,
          is_checked: node.is_checked,
          growth_exercise_id: node.growth_exercise_id,
          content: node.content,
          notes: node.notes,
          children: [],
        });
      }
    });

    // Second pass to link parents and children
    nodes.forEach((node) => {
      if (!node.id) return;
      const child = map[node.id];

      const parent = node.parent_id ? map[node.parent_id] || root : root; // Fallback to root if parent is not found

      // Directly push the child to the parent's children array
      parent.children.push(child);

      // Optionally sort the children array based on rel_order
      parent.children.sort((a, b) => a.rel_order - b.rel_order);
    });

    UITree.computePosIndex(root);

    return root;
  }

  /**
   * This function takes an array of outline items and creates nodes.
   */
  createNodesFromSections(
    sections: Section[],
    parentId: string | null = null
  ): void {
    sections.forEach((section, sectionIndex) => {
      // Create a node for the section
      const sectionId = uuidv4();
      const sectionNode = new Node({
        id: sectionId,
        text: section.name,
        parent_id: parentId,
        rel_order: sectionIndex,
        is_task: false,
        is_checked: false,
        growth_exercise_id: "",
        locked: false,
        content: "",
        notes: "",
      });
      this.nodes.push(sectionNode);

      // Process tasks within the section
      section.tasks.forEach((task, taskIndex) => {
        const taskId = uuidv4();
        const taskNode = new Node({
          id: taskId,
          text: task.text,
          parent_id: sectionId,
          rel_order: taskIndex,
          is_task: task.is_task,
          is_checked: false,
          growth_exercise_id: "",
          locked: false,
          content: task.content || "",
          notes: task.notes || "",
        });
        this.nodes.push(taskNode);
      });
    });
  }

  static flattenRenderTree(root: NodeForRender): NodeForRender[] {
    const flatArray: NodeForRender[] = [];
    flatArray.push(root);

    root.children.forEach((child) => {
      flatArray.push(...UITree.flattenRenderTree(child));
    });

    return flatArray;
  }

  /**
   * This function takes a node id and returns the node's pos_index
   * Steps
   *  Takes node id
   *  Creates the tree with pos_index
   *  Traverses the tree to find the node
   *  Returns the pos_index of the node
   */
  getPosIndex(nodeId: string): number {
    const tree = UITree.buildTree(this.nodes);
    const flatTree = UITree.flattenRenderTree(tree);

    const node = flatTree.find((node) => node.id === nodeId);
    return node ? node.pos_index : -1;
  }

  treeToString(): string {
    // Helper function to recursively build the string
    const buildString = (node: Node, depth: number): string => {
      const indent = " ".repeat(depth * 2); // 2 spaces per depth level
      const prefix = node.is_task ? "[] " : ""; // Add [] if it's an action item
      let result = `${indent}${prefix}${node.text}\n`;

      // Recursively process children
      const children = this.nodes.filter((n) => n.parent_id === node.id);
      children.forEach((child) => {
        result += buildString(child, depth + 1);
      });

      return result;
    };

    // Start with root nodes (nodes without a parent)
    let output = "";
    const rootNodes = this.nodes.filter((n) => n.parent_id === null);
    rootNodes.forEach((rootNode) => {
      output += buildString(rootNode, 0);
    });

    return output.trim(); // Trim to remove the last newline
  }
}

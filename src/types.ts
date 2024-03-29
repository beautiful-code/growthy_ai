import { Node } from "domain/node/Node";

export type TUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
};

export type Task = {
  text: string;
  is_task: boolean;
  indentation_level: number;
  locked?: boolean;
  notes?: string;
  content?: string;
};

export type Section = {
  name: string;
  tasks: Task[];
};

export type TSuggestedGrowthExercise = {
  id: string;
  summary: string;
  title: string;
  outline: Node[];
};

export type Dictionary = {
  [key: string]: any;
};

// Database entry for a growth exercise
export type TGrowthExercise = {
  id: string;
  title: string;
  inputs: Dictionary;
  state: "created" | "outlined" | "published";
  user_id: string;
  guild_id?: string;
  type: "study-exercise" | "blog-article";
  created_at?: string;
  updated_at?: string;
};

export type BlogArticle = {
  title: string;
  sections: Section[];
};

// Database entry for Node
export type TNode = {
  id: string;
  text: string;
  rel_order: number;
  is_task: boolean;
  is_checked: boolean;
  growth_exercise_id: string;
  parent_id: string;
  created_at?: string;
  updated_at?: string;
};

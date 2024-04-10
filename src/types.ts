export type TUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
};

export type Dictionary = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Database entry for Node
export type TNode = {
  id: string;
  text: string;
  rel_order: number;
  is_task: boolean;
  is_checked: boolean;
  growth_exercise_id: string;
  parent_id: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TaskV2 = {
  text: string;
  is_action_item: boolean;
};

export type TSectionV2 = {
  title: string;
  tasks: TaskV2[];
};

export type TExercise = {
  id: string;
  title: string;
  user_id?: string;
  guild_id?: string;
  type: "study-exercise" | "blog-article";
}

export type TExerciseWithUser = {
  exercise: TExercise;
  author: TUser;
}

export type TExerciseFilter = {
  blogArticle: boolean;
  studyExercise: boolean;
  til: boolean;
};

export type TGuild = {
  id: string;
  name: string;
  led_by: string;
}

export type TGuildUser = {
  id: string;
  name: string;
  led_by: string;
  user?: TUser;
}

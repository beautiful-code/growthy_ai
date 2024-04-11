export type TUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
};

export type Dictionary = {
  [key: string]: any;
};

// Database entry for a growth exercise
export type TGrowthExercise = {
  id?: string;
  inputs: Dictionary;
  state: "created" | "outlined" | "published";
  user_id?: string;
  guild_id?: string;
  type: "study-exercise" | "blog-article";
  xml_text: string;
  created_at?: string;
  updated_at?: string;
};

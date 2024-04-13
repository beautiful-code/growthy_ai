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

export type TExercise = {
  id: string;
  user_id?: string;
  guild_id?: string;
  type: "study-exercise" | "blog-article";
  xml_text: string;
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

export type PublicationSection = {
  sectionTitle: string,
  content: string[]
}

export type ExercisePublication = {
  publicationTitle: string,
  publicationSections: PublicationSection[]
}

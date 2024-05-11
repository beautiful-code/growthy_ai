import { PostgrestError } from "@supabase/supabase-js";
import { FixtureWrapper } from "FixtureWrapper";

import { TGrowthExercise } from "types";
import { ModifyOutline } from "./ModifyOutline";

const mockExercise: TGrowthExercise = {
  id: "1234",
  inputs: {},
  state: "created",
  user_id: "1",
  guild_id: "1",
  type: "blog-article",
  xml_text: `
  <BlogArticle>
    <Title name='Blog Title' />
    <Outline>
      <Section name='section1'>
        <Task name='task1' />
        <Task name='task2' />
      </Section>
    </Outline>
  </BlogArticle>
  `,
};

const mockUpdatedOutline = `
<BlogArticle>
  <Title name="Diving Into Ruby: A Beginner's Guide to Ruby Basics" />
  <Outline>
    <Section name="Introduction to Ruby">
      <Task name="Explain what Ruby is and its history" />
      <Task name="Discuss the philosophy behind Ruby" />
    </Section>
    <Section name="Getting Started with Ruby">
      <SubSection name="Setting Up the Ruby Environment">
        <Task name="Guide on installing Ruby" />
        <Task name="Introduce basic Ruby tools and IDEs" />
      </SubSection>
      <SubSection name="Your First Ruby Program">
        <Task name="Walkthrough creating and running a simple Ruby script" />
        <Task name="Explain how to use IRB (Interactive Ruby)" />
      </SubSection>
    </Section>
    <Section name="Conclusion">
      <Task name="Summarize the key points covered in the article" />
      <Task name="Encourage further exploration and learning" />
    </Section>
  </Outline>
</BlogArticle>`;

const mockGetExercise = (
  _id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockExercise, error: null });
    }, 2000);
  });
};

const mockGetBlogArticleXMLSuggestion = async ({
  blog_article_goal,
  blog_article_points,
}: {
  blog_article_goal: string;
  blog_article_points?: string;
}): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUpdatedOutline);
    }, 2000);
  });
};

export default {
  ModifyOutline: () => {
    return (
      <FixtureWrapper>
        <ModifyOutline
          useParams={() => ({ growthExerciseId: "123" })}
          getExercise={mockGetExercise}
          saveGrowthExercise={async () => ({
            data: mockExercise,
            error: null,
          })}
          getBlogArticleXMLSuggestion={mockGetBlogArticleXMLSuggestion}
        />
      </FixtureWrapper>
    );
  },
};

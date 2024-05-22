import { Meta, StoryObj } from "@storybook/react";
import { PostgrestError } from "@supabase/supabase-js";
import { FixtureWrapper } from "FixtureWrapper";
import {
  CreateBlogArticleView,
  CreateBlogArticleViewProps,
} from "growth-exercise/components/blog-article/CreateBlogArticleView";
import { TGrowthExercise } from "types";

const mockSaveGrowthExercise = (
  growthExercise: TGrowthExercise
): Promise<{ data: TGrowthExercise; error: PostgrestError | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("mockSaveGrowthExercise", growthExercise);
      resolve({
        data: growthExercise,
        error: null,
      });
    }, 1000);
  });
};

const mockGetArticleXMLSuggestion = ({
  blog_article_goal,
  blog_article_points,
}: {
  blog_article_goal: string;
  blog_article_points: string;
}): Promise<string> => {
  return new Promise<string>((resolve) => {
    console.log({
      blog_article_goal,
      blog_article_points,
    });
    setTimeout(() => {
      resolve(`
        <BlogArticle>
        <Title name='Blog Title' />
        <Outline>
          <Section name='section1'>
          <Task name='task1' />
          <Task name='task2' />
          </Section>
        </Outline>
        </BlogArticle>
      `);
    }, 1000);
  });
};

const onCreateGrowthExerciseCallback = (
  growthExercise: TGrowthExercise | null,
) => {
  if (growthExercise) {
    console.log("onCreateGrowthExerciseCallback called with ", growthExercise);
  }
};

const CreateBlogArticleViewStory: React.FC<CreateBlogArticleViewProps> = ({
  ...props
}) => {
  return (
    <FixtureWrapper>
      <CreateBlogArticleView {...props} />
    </FixtureWrapper>
  );
};

const meta = {
  title: "Growth Exercise/Blog Article/CreateBlogArticleView",
  component: CreateBlogArticleViewStory,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof CreateBlogArticleView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseCase: Story = {
  args: {
    getBlogArticleXMLSuggestion: mockGetArticleXMLSuggestion,
    saveGrowthExercise: mockSaveGrowthExercise,
    onCreateGrowthExerciseCallback: onCreateGrowthExerciseCallback,
  },
};

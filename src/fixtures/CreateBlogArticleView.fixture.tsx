import { PostgrestError } from "@supabase/supabase-js";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { CreateBlogArticleView } from "growth-exercise/components/blog-article/CreateBlogArticleView";
import { TGrowthExercise } from "types";

const mockSaveGrowthExercise = (
  growthExercise: TGrowthExercise
): Promise<{ data: TGrowthExercise; error: PostgrestError | null }> => {
  // Pranav - This timeout block is not making sense. We should be returning data after 1 sec.
  setTimeout(() => {
    console.log("mockSaveGrowthExercise", growthExercise);
  }, 1000);

  return Promise.resolve({
    data: growthExercise,
    error: null,
  });
};

const mockGetArticleXMLSuggestion = (
  _blog_article_goal: string,
  _blog_article_points: string
): Promise<string> => {
  return new Promise<string>((resolve) => {
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
  });
}

const onCreateGrowthExerciseCallback = (growthExercise: TGrowthExercise | null, _navigate: (path: string) => void) => {
  if (growthExercise) {
    console.log("onCreateGrowthExerciseCallback called with ", growthExercise);
  }
}


export default {
  "base case": () => {
    return (
      <FixtureWrapper>
        <CreateBlogArticleView
          getBlogArticleXMLSuggestion={mockGetArticleXMLSuggestion}
          saveGrowthExercise={mockSaveGrowthExercise}
          onCreateGrowthExerciseCallback={onCreateGrowthExerciseCallback}
        />
      </FixtureWrapper>
    );
  },
};

// Pranav - Other issues that need to be fixed.
// Expand All and Collapse All are not working
// Get Ideas button is not working

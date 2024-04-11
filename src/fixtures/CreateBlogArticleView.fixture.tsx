import { PostgrestError } from "@supabase/supabase-js";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { CreateBlogArticleView } from "growth-exercise/components/blog-article/CreateBlogArticleView";
import { TGrowthExercise } from "types";

const mockSaveGrowthExercise = (
  growthExercise: TGrowthExercise
): Promise<{ data: TGrowthExercise; error: PostgrestError | null }> => {
  setTimeout(() => {
    console.log("mockSaveGrowthExercise", growthExercise);
  }, 1000);

  return Promise.resolve({
    data: growthExercise,
    error: null,
  });
};

export default {
  "base case": () => {
    return (
      <FixtureWrapper>
        <CreateBlogArticleView
          getBlogArticleXMLSuggestion={(
            _blog_article_goal: string,
            _blog_article_points: string
          ) => {
            return new Promise<string>((resolve) => {
              resolve(
                "<BlogArticle><Title name='Blog Title' /><Outline><Section name='section1'><Task name='task1' /><Task name='task2' /></Section></Outline></BlogArticle>"
              );
            });
          }}
          saveGrowthExercise={mockSaveGrowthExercise}
          onCreateGrowthExercise={(growthExercise, _navigate) => {
            console.log(growthExercise);
            console.log("mock navigate");
          }}
        />
      </FixtureWrapper>
    );
  },
};

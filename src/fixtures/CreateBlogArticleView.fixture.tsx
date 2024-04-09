import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { CreateBlogArticleView } from "growth-exercise/components/blog-article/CreateBlogArticleView";

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
        />
      </FixtureWrapper>
    );
  },
};

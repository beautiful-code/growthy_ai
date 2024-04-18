import { useState } from "react";
import { BlogArticle } from "growth-exercise/components/blog-article/BlogArticle";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { FixtureWrapper } from "FixtureWrapper";

export default {
  "base case": () => {
    const [generatedBlogArticleXML, setGeneratedBlogArticleXML] = useState(
      `
      <BlogArticle>
        <Title name='Blog Title' />
        <Outline>
          <Section name='section1'>
            <Task name='task1' />
            <Task name='task2' />
          </Section>
        </Outline>
      </BlogArticle>
      `
    );

    return (
      <FixtureWrapper>
        <BlogArticle
          blogArticle={new UIBlogArticle(generatedBlogArticleXML)}
          onBlogArticleUpdate={(blogArticle) => {
            console.log("onBlogArticleUpdate called");
            setGeneratedBlogArticleXML(blogArticle._xml);
          }}
          handleAddBlogArticle={() => {
            console.log("handleAddBlogArticle called");
          }}
        />
      </FixtureWrapper>
    );
  },
};

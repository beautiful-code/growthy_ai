import { useState } from "react";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Outline } from "common/components/outline/Outline";
import { BlogArticle } from "domain/blog-article/BlogArticleV2";

const blogArticle = new BlogArticle(
  `<BlogArticle>
    <Title name="Title" />
    <Outline>
      <Section name="Section 1">
        <Task name="Task 1" is_action_item="true" />
        <Task name="Task 2" is_action_item="true" />
      </Section>
      <Section name="Section 2">
        <Task name="Task 3" is_action_item="true" />
        <Task name="Task 4" is_action_item="true" />
      </Section>
      <Section name="Section 3">
        <Task name="Task 5" is_action_item="true" />
        <Task name="Task 6" is_action_item="true" />
      </Section>
      <Section name="Section 4">
        <Task name="Task 7" is_action_item="true" />
        <Task name="Task 8" is_action_item="true" />
      </Section>
    </Outline>
  </BlogArticle>`
);

export default {
  "base case": () => {
    const [blogArticleXML, setBlogArticleXML] = useState(
      blogArticle.blogArticleXml
    );

    return (
      <FixtureWrapper>
        <Outline
          blogArticleXML={blogArticleXML}
          setBlogArticleXml={setBlogArticleXML}
        />
      </FixtureWrapper>
    );
  },
  "checking disabled": () => {
    const [blogArticleXML, setBlogArticleXML] = useState(
      blogArticle.blogArticleXml
    );

    return (
      <FixtureWrapper>
        <Outline
          checkingDisabled={true}
          blogArticleXML={blogArticleXML}
          setBlogArticleXml={setBlogArticleXML}
        />
      </FixtureWrapper>
    );
  },
  "checking enabled": () => {
    const [blogArticleXML, setBlogArticleXML] = useState(
      blogArticle.blogArticleXml
    );

    return (
      <FixtureWrapper>
        <Outline
          checkingDisabled={false}
          blogArticleXML={blogArticleXML}
          setBlogArticleXml={setBlogArticleXML}
        />
      </FixtureWrapper>
    );
  },
};

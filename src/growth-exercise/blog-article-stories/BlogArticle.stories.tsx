import { useState } from "react";
import {
  BlogArticle,
  BlogArticleProps,
} from "growth-exercise/components/blog-article/BlogArticle";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<BlogArticleProps> = {
  title: "Growth Exercise/Blog Article/BlogArticle",
  component: BlogArticle,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<BlogArticleProps>;

export const BaseCase: Story = {
  args: {},
  render: (args) => {
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
          {...args}
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

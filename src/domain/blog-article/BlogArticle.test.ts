import { BlogArticle } from "./BlogArticle";
import { Node } from "domain/node/Node";
import { TGrowthExercise } from "types";

describe("BlogArticle", () => {
  // Note: Removed the createBlogArticle test since it's now part of the constructor logic.

  describe("constructor and buildBlogArticleXml", () => {
    it("should create a BlogArticle object from idea and nodes and build XML from it", () => {
      const growthExercise: TGrowthExercise = {
        id: "1",
        title: "Test Title",
        inputs: {},
        state: "created",
        user_id: "1",
        type: "blog-article",
      };
      const nodes: Node[] = [
        new Node({
          id: "1",
          text: "Introduction",
          parent_id: null,
          rel_order: 0,
          is_task: false,
          is_checked: false,
          growth_exercise_id: "",
        }),
        new Node({
          id: "2",
          text: "Task 1",
          parent_id: "1",
          rel_order: 0,
          is_task: true,
          is_checked: false,
          growth_exercise_id: "",
        }),
      ];

      const blogArticle = new BlogArticle(growthExercise, nodes);
      expect(blogArticle.title).toEqual(growthExercise.title);
      expect(blogArticle.sections.length).toBe(1);
      expect(blogArticle.sections[0].name).toEqual("Introduction");
      expect(blogArticle.sections[0].tasks.length).toBe(1);
      expect(blogArticle.sections[0].tasks[0].text).toEqual("Task 1");

      const xml = blogArticle.buildBlogArticleXml();
      expect(xml).toContain("<BlogArticle>");
      expect(xml).toContain('<Title name="Test Title" />');
      expect(xml).toContain('<Section name="Introduction">');
      expect(xml).toContain(
        '<Task name="Task 1" is_task="true" indentation_level="1" locked="false" />'
      );
    });
  });

  // The parseBlogArticle test remains unchanged.
  describe("parseBlogArticle", () => {
    it("should parse XML string into a BlogArticle object", () => {
      const xml = `<BlogArticle>
  <Title name="Test Title" />
  <Section name="Introduction">
    <Task name="Task 1" is_task="true" indentation_level="1" />
  </Section>
</BlogArticle>`;

      const result = BlogArticle.parseBlogArticle(xml);
      expect(result.title).toEqual("Test Title");
      expect(result.sections.length).toBe(1);
      expect(result.sections[0].name).toEqual("Introduction");
      expect(result.sections[0].tasks.length).toBe(1);
      expect(result.sections[0].tasks[0].text).toEqual("Task 1");
    });
  });
});

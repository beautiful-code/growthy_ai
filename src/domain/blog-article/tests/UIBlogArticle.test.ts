import { UIOutline } from "domain/common/UIOutline";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";

describe("UIBlogArticle", () => {
  it("should construct a UIBlogArticle", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" uuid="1" checked="false" />
            <Task name="Task 2" uuid="2" checked="false" />
        </Section>
        </Outline>
        </BlogArticle>`;
    const blogArticle = new UIBlogArticle(xml);
    expect(blogArticle).toBeDefined();
    expect(blogArticle.getUIStatelessXML()).toEqualXml(xml);
  });

  it("should get the title of the blog article", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" uuid="1" />
            <Task name="Task 2" uuid="2" />
        </Section>
        </Outline>
        </BlogArticle>`;
    const blogArticle = new UIBlogArticle(xml);
    expect(blogArticle.getTitle()).toEqual("Title");
  });

  it("should update the title of the blog article", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" uuid="1" />
            <Task name="Task 2" uuid="2" />
        </Section>
        </Outline>
        </BlogArticle>`;
    const blogArticle = new UIBlogArticle(xml);
    blogArticle.updateTitle("New Title");
    expect(blogArticle.getTitle()).toEqual("New Title");
  });

  it("should update outline of the blog article", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" uuid="1" />
            <Task name="Task 2" uuid="2" />
        </Section>
        </Outline>
        </BlogArticle>`;

    const blogArticle = new UIBlogArticle(xml);

    const newOutline = `<Outline>
        <Section name="section 2">
            <Task name="Task 3" uuid="3" />
            <Task name="Task 4" uuid="4" />
        </Section>
        </Outline>`;
    const outline = new UIOutline(newOutline);
    blogArticle.updateOutline(outline);

    expect(blogArticle?.getOutline()?._xml).toEqualXml(
      new UIOutline(newOutline)._xml
    );
  });
});

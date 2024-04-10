import { UIBlogArticle } from "./UIBlogArticle";
import { UIOutline } from "./UIOutline";

describe("UIBlogArticle", () => {
  it("should construct a UIBlogArticle", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" />
            <Task name="Task 2" />
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
            <Task name="Task 1" />
            <Task name="Task 2" />
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
            <Task name="Task 1" />
            <Task name="Task 2" />
        </Section>
        </Outline>
        </BlogArticle>`;
    const blogArticle = new UIBlogArticle(xml);
    blogArticle.updateTitle("New Title");
    // TODO - Pranav. Since you are testing the updating of blog article, you 
    // should call the getTitle method again to test
    // If you are testing the XML, you should call a method that returns the XML
    expect(blogArticle.getUIStatelessXML()).toEqualXml(`<BlogArticle>
        <Title name="New Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" />
            <Task name="Task 2" />
        </Section>
        </Outline>
        </BlogArticle>`);
  });

  it("should update outline of the blog article", () => {
    const xml = `<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 1">
            <Task name="Task 1" />
            <Task name="Task 2" />
        </Section>
        </Outline>
        </BlogArticle>`;

    const blogArticle = new UIBlogArticle(xml);

    const newOutline = `<Outline>
        <Section name="section 2">
            <Task name="Task 3" />
            <Task name="Task 4" />
        </Section>
        </Outline>`;
    const outline = new UIOutline(newOutline);
    blogArticle.updateOutline(outline);

    // Pranav - I've added the first expectation. You dont need the expectation you have 
    // written. You can delete it.
    expect(blogArticle.getOutline()._xml).toEqualXml((new UIOutline(newOutline))._xml);
    expect(blogArticle.getUIStatelessXML()).toEqualXml(`<BlogArticle>
        <Title name="Title" />
        <Outline>
        <Section name="section 2">
            <Task name="Task 3" />
            <Task name="Task 4" />
        </Section>
        </Outline>
        </BlogArticle>`);
  });
});

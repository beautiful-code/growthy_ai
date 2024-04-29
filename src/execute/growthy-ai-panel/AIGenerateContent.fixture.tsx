import { FixtureWrapper } from "FixtureWrapper";

import { AIGenerateContent } from "execute/growthy-ai-panel/AIGenerateContent";

const mockGenerateContent = () => {
  return new Promise<string>((resolve) =>
    setTimeout(() => {
      resolve(`\`\`\`xml
  <BlogArticle>
    <Title name="Embarking on the Journey of Sanskrit: A Personal Odyssey" />
    <Outline>
      <Section name="Introduction to My Sanskrit Journey">
        <Task name="Share personal background">
          <Content>
            ### A Glimpse into My Life Before Sanskrit
            My journey into the world of Sanskrit began from a place of curiosity and a deep-rooted interest in ancient cultures. Growing up, I was always fascinated by the rich tapestry of history and the languages that shaped civilizations. This curiosity was the seed that eventually grew into a passionate endeavor to learn Sanskrit.
          </Content>
        </Task>
        <Task name="Explain motivations for learning Sanskrit">
          <Content>
            ### Why Sanskrit?
            The motivation to learn Sanskrit was twofold. Firstly, the desire to connect with an ancient heritage and understand the philosophical underpinnings of texts like the Bhagavad Gita and Upanishads. Secondly, the challenge it presented. Sanskrit, with its complex grammar and rich vocabulary, promised a journey not just into a language but into a way of thinking and seeing the world.
          </Content>
        </Task>
      </Section>
      <Section name="Discovering The Sanskrit Channel">
        <Task name="Describe how I found The Sanskrit Channel">
          <Content>
            ### Finding a Guide in The Sanskrit Channel
            My discovery of The Sanskrit Channel was serendipitous. In search of resources to begin my learning journey, I stumbled upon this treasure trove of knowledge. It was the clarity and depth of the content that drew me in, making the daunting task of learning Sanskrit seem approachable and exciting.
          </Content>
        </Task>
        <Task name="Discuss resources and content available on The Sanskrit Channel">
          <Content>
            ### A Wealth of Resources
            The Sanskrit Channel offered more than just lessons; it was a gateway to a community of learners and a variety of resources. From detailed video tutorials to engaging discussions on scriptural texts, it provided a holistic approach to learning Sanskrit that catered to both beginners and advanced students alike.
          </Content>
        </Task>
      </Section>
      <Section name="My Daily Sanskrit Learning Routine">
        <SubSection name="Setting a Schedule">
          <Task name="Outline daily learning schedule">
            <Content>
              ### Crafting a Daily Learning Schedule
              Establishing a daily routine was crucial for my progress. I dedicated early mornings to Sanskrit, starting with a review of the previous day's lessons, followed by new tutorials from The Sanskrit Channel. This consistency not only built a strong foundation but also integrated Sanskrit into my daily life.
            </Content>
          </Task>
          <Task name="Discuss time management strategies for learning">
            <Content>
              ### Time Management Strategies
              Balancing learning with other responsibilities required discipline and planning. I found that setting realistic goals, breaking down tasks into manageable chunks, and using digital tools for scheduling and reminders helped me stay on track without feeling overwhelmed.
            </Content>
          </Task>
        </SubSection>
        <SubSection name="Learning Methods">
          <Task name="Describe various learning methods used">
            <Content>
              ### Exploring Diverse Learning Methods
              My approach to learning Sanskrit was multifaceted. Alongside video lessons, I incorporated reading ancient texts, practicing writing, and engaging in conversation practice. This variety not only made learning more enjoyable but also deepened my understanding and retention of the language.
            </Content>
          </Task>
          <Task name="Share experience with interactive exercises and practices">
            <Content>
              ### The Power of Interactive Learning
              Interactive exercises, such as quizzes and speaking assignments, played a pivotal role in my learning journey. They provided immediate feedback and a practical application of theoretical knowledge, which was instrumental in mastering complex grammatical structures and vocabulary.
            </Content>
          </Task>
        </SubSection>
      </Section>
      <Section name="Reflections and Impressions">
        <Task name="Share initial impressions of learning Sanskrit">
          <Content>
            ### Initial Impressions and Revelations
            The initial phase of learning Sanskrit was both exhilarating and challenging. The beauty and precision of the language were captivating, yet the complexity of its grammar was daunting. However, each milestone achieved was a testament to the richness of Sanskrit and its relevance even in the modern world.
          </Content>
        </Task>
        <Task name="Discuss challenges faced and how they were overcome">
          <Content>
            ### Overcoming Challenges
            The journey was not without its hurdles. From grappling with Sanskrit's intricate syntax to finding time for consistent study, challenges were plentiful. Overcoming these obstacles required persistence, creative problem-solving, and the support of the Sanskrit learning community. Each challenge surmounted brought me closer to the language and its timeless wisdom.
          </Content>
        </Task>
      </Section>
    </Outline>
  </BlogArticle>
  \`\`\``);
    }, 1000)
  );
};

export default {
  AIGenerateContent: (
    <FixtureWrapper>
      <AIGenerateContent
        blogArticleInputs={{
          blog_article_goal: "Learn sanskrit",
          blog_article_xml: `<BlogArticle>
          <Title name="Embarking on the Journey of Sanskrit: A Personal Odyssey" />
          <Outline>
            <Section name="Introduction to My Sanskrit Journey">
              <Task name="Share personal background" />
              <Task name="Explain motivations for learning Sanskrit" />
            </Section>
            <Section name="Discovering The Sanskrit Channel">
              <Task name="Describe how I found The Sanskrit Channel" />
              <Task name="Discuss resources and content available on The Sanskrit Channel" />
            </Section>
            <Section name="My Daily Sanskrit Learning Routine">
              <SubSection name="Setting a Schedule">
                <Task name="Outline daily learning schedule" />
                <Task name="Discuss time management strategies for learning" />
              </SubSection>
              <SubSection name="Learning Methods">
                <Task name="Describe various learning methods used" />
                <Task name="Share experience with interactive exercises and practices" />
              </SubSection>
            </Section>
            <Section name="Reflections and Impressions">
              <Task name="Share initial impressions of learning Sanskrit" />
              <Task name="Discuss challenges faced and how they were overcome" />
            </Section>
          </Outline>
        </BlogArticle>`,
        }}
        onClose={() => console.log("onClose")}
        generateContent={mockGenerateContent}
      />
    </FixtureWrapper>
  ),
};

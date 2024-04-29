import { FixtureWrapper } from "FixtureWrapper";
import { GrowthyConversation } from "common/components/GrowthyConversation";

const mockGetGuidance = async () => {
  return (async function* () {
    yield "Mocked response";
  })();
};

export default {
  "Growthy Coversation with GoRoutines blog article": (
    <FixtureWrapper>
      <GrowthyConversation
        inputs={{
          blog_article_goal: "",
          blog_article_xml: "",
          blog_article_task: "",
        }}
        onCloseCallback={() => {}}
        getConversation={mockGetGuidance}
      />
    </FixtureWrapper>
  ),
};

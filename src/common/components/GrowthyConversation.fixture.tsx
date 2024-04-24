import { FixtureWrapper } from "FixtureWrapper";
import { GrowthyConversation } from "common/components/GrowthyConversation";

const mockGetGuidance = async () => {
  return (async function* () {
    yield "Mocked response";
  })();
};

export default {
  GoLang: (
    <FixtureWrapper>
      <GrowthyConversation
        inputs={{
          blog_title: "GoLang",
          blog_points: [""],
          isAdditionalPrompt: false,
        }}
        onClose={() => {}}
        getConversation={mockGetGuidance}
      />
    </FixtureWrapper>
  ),
  Python: (
    <FixtureWrapper>
      <GrowthyConversation
        inputs={{
          blog_title: "Python",
          blog_points: [""],
          isAdditionalPrompt: false,
        }}
        onClose={() => {}}
        getConversation={mockGetGuidance}
      />
    </FixtureWrapper>
  ),
};

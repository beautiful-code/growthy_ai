import { FixtureWrapper } from "fixtures/FixtureWrapper";
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
        blogTitle="GoLang"
        blogPoints={[""]}
        isAdditionalPrompt={false}
        onClose={() => {}}
        getGuidance={mockGetGuidance}
      />
    </FixtureWrapper>
  ),
  Python: (
    <FixtureWrapper>
      <GrowthyConversation
        blogTitle="Python"
        blogPoints={[""]}
        isAdditionalPrompt={false}
        onClose={() => {}}
        getGuidance={mockGetGuidance}
      />
    </FixtureWrapper>
  ),
};

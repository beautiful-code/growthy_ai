import { FixtureWrapper } from "common/components/FixtureWrapper";
import { GrowthyConversation } from "./GrowthyConversation";

const mockGetGuidance = async () => {
  return (async function* () {
    yield "Mocked response";
  })();
};

export default (
  <FixtureWrapper>
    <GrowthyConversation
      blogTitle="GoLang"
      blogPoints={[""]}
      isAdditionalPrompt={false}
      onClose={() => {}}
      getGuidance={mockGetGuidance}
    />
  </FixtureWrapper>
);

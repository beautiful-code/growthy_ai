import { PostgrestError } from "@supabase/supabase-js";
import { FixtureWrapper } from "FixtureWrapper";

import { ExecuteView } from "execute/ExecuteView";
import { TGrowthExercise } from "types";

const mockExercise: TGrowthExercise = {
  id: "1234",
  inputs: {},
  state: "created",
  user_id: "1",
  guild_id: "1",
  type: "blog-article",
  xml_text: `
  <BlogArticle>
    <Title name='Blog Title' />
    <Outline>
      <Section name='section1'>
        <Task name='task1' />
        <Task name='task2' />
      </Section>
    </Outline>
  </BlogArticle>
  `,
};

const mockGetExercise = (
  _id: string
): Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockExercise, error: null });
    }, 2000);
  });
};

const mockGetGuidance = async () => {
  return (async function* () {
    yield "Mocked response";
  })();
};

export default {
  ExecuteView: () => {
    return (
      <FixtureWrapper>
        <ExecuteView
          useParams={() => ({ growthExerciseId: "123" })}
          getExercise={mockGetExercise}
          saveGrowthExercise={async () => ({
            data: mockExercise,
            error: null,
          })}
          getGuidance={mockGetGuidance}
        />
      </FixtureWrapper>
    );
  },
};

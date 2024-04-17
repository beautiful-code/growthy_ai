import { ExercisePublication, PublicationSection } from "types";
import { FixtureWrapper } from "../fixtures/FixtureWrapper";
import { PublicationView } from "./PublicationView";

const publicationSections: PublicationSection[] = [
  {
    title: "Introduction to My Sanskrit Journey",
    content: "Dummy content 5",
  },
  {
    title: "Discovering The Sanskrit Channel",
    content:
      "Dummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4",
  },
  {
    title: "My Daily Sanskrit Learning Routine",
    content: "Dummy content 3",
  },
  {
    title: "Reflections and Impressions",
    content: "Dummy content 1\nDummy content 2",
  },
];

const exercisePublication: ExercisePublication = {
  title: "Dummy Exercise",
  sections: publicationSections,
}

export default {
  Basecase: () => {
    <FixtureWrapper>
      <PublicationView 
        useGetExercisePublication={(exerciseId: string) => {
            console.log("useGetExercisePublication called with ", exerciseId);
            return {data: exercisePublication, isLoading: false}
        }}
        useParams={() => ({ id: "123" })}
      />
    </FixtureWrapper>    
  },
};

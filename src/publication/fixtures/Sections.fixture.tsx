import { PublicationSection } from "types";
import { FixtureWrapper } from "../../fixtures/FixtureWrapper";
import { Sections } from "publication/components/Sections";
import { useState } from "react";

const publicationSections: PublicationSection[] = [
  {
    title: "Introduction to My Sanskrit Journey",
    content: `Dummy content 5`,
  },
  {
    title: "Discovering The Sanskrit Channel",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
  {
    title: "My Daily Sanskrit Learning Routine",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
  {
    title: "Reflections and Impressions",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
];

export default {
  "Base Case": () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
    const onSelectionCallback = (id: number) => {
      setSelectedSectionIndex(id);
    };
    return (
      <FixtureWrapper>
        <Sections
          publicationSections={publicationSections}
          selectedSectionIndex={selectedSectionIndex}
          onTopSectionChange={onSelectionCallback}
        />
      </FixtureWrapper>
    );
  },
};

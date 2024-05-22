import { SectionList, SectionListProps } from "publication/components/SectionList";
import { PublicationSection } from "types";
import { useState } from "react";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const publicationSections: PublicationSection[] = [
  {
    title: "Introduction to My Sanskrit Journey",
    content: "Dummy Content 5",
  },
  {
    title: "Discovering The Sanskrit Channel",
    content: "Dummy content 4",
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

const meta: Meta<SectionListProps> = {
  title: "Publication/SectionList",
  component: SectionList,
  tags: ["autodocs"],
  args: {
    publicationSections,
  },
};

export default meta;

type Story = StoryObj<SectionListProps>;

export const WithCallback: Story = {
  args: { 
    publicationSections: publicationSections,
  },
  render: (args) => {
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
    const onSelectionCallback = (id: number) => {
      setSelectedSectionIndex(id);
    };

    return (
      <FixtureWrapper>
        <SectionList
          {...args}
          onSelectionCallback={onSelectionCallback}
          selectedSectionIndex={selectedSectionIndex}
        />
      </FixtureWrapper>
    );
  },
};

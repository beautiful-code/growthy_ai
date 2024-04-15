import { SectionList } from "preview/components/SectionList";
import { FixtureWrapper } from "./FixtureWrapper";
import { PublicationSection } from "types";

const publicationSections: PublicationSection[] = [
    {
        "sectionTitle": "Introduction to My Sanskrit Journey",
        "sectionContent": "Dummy Content 5"
    },
    {
        "sectionTitle": "Discovering The Sanskrit Channel",
        "sectionContent": "Dummy content 4"
    },
    {
        "sectionTitle": "My Daily Sanskrit Learning Routine",
        "sectionContent": "Dummy content 3"
    },
    {
        "sectionTitle": "Reflections and Impressions",
        "sectionContent": "Dummy content 1\nDummy content 2"
    }
]

export default {
    "Without Callback": (
        <FixtureWrapper>
            <SectionList publicationSections={publicationSections} />
        </FixtureWrapper>
    ),
    "With Callback": (
        <FixtureWrapper>
            <SectionList publicationSections={publicationSections} onSelectionCallback={(id:number ) => {
                console.log(`Selected section with id: ${id}`)
            }} />
        </FixtureWrapper>
    ),
}
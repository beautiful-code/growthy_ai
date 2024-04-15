import { Sections } from "preview/components/Sections"
import { PublicationSection } from "types"
import { FixtureWrapper } from "./FixtureWrapper"

const publicationSections: PublicationSection[] = [
    {
        sectionTitle: "Introduction to My Sanskrit Journey",
        sectionContent: `Dummy content 5`
    },
    {
        sectionTitle: "Discovering The Sanskrit Channel",
        sectionContent: `Dummy content 1
Dummy content 2
Dummy content 3
Dummy content 4
Dummy content 5
Dummy content 6
Dummy content 7`
    },
    {
        sectionTitle: "My Daily Sanskrit Learning Routine",
        sectionContent: `Dummy content 1
Dummy content 2
Dummy content 3
Dummy content 4
Dummy content 5
Dummy content 6
Dummy content 7`
    },
    {
        sectionTitle: "Reflections and Impressions",
        sectionContent: `Dummy content 1
Dummy content 2
Dummy content 3
Dummy content 4
Dummy content 5
Dummy content 6
Dummy content 7`
    }
]

export default {
    "With default selected index": (
        <FixtureWrapper>
            <Sections publicationSections={publicationSections} selectedSectionIndex={0}  />
        </FixtureWrapper>
    ),
    "With specific selected index": (
        <FixtureWrapper>
            <Sections publicationSections={publicationSections} selectedSectionIndex={2}  />
        </FixtureWrapper>
    ),
}
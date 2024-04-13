import { RenderSection } from "preview/components/RenderSection"
import { PublicationSection } from "types"
import { FixtureWrapper } from "./FixtureWrapper"

const publicationSections: PublicationSection[] = [
    {
        "sectionTitle": "Introduction to My Sanskrit Journey",
        "content": [
            "Dummy content 5"
        ]
    },
    {
        "sectionTitle": "Discovering The Sanskrit Channel",
        "content": [
            "Dummy content 4"
        ]
    },
    {
        "sectionTitle": "My Daily Sanskrit Learning Routine",
        "content": [
            "Dummy content 3"
        ]
    },
    {
        "sectionTitle": "Reflections and Impressions",
        "content": [
            "Dummy content 1\nDummy content 2"
        ]
    }
]

export default {
    "Basecase": (
        <FixtureWrapper>
            {publicationSections.map((publicationSection, index) => (
                <RenderSection publicationSection={publicationSection} sectionIndex={String(index)}  />
            ))}
        </FixtureWrapper>
    ),
}
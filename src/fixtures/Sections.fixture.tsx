import { Sections } from "preview/components/Sections";
import { FixtureWrapper } from "./FixtureWrapper";
import { PublicationSection } from "types";

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
            <Sections publicationSections={publicationSections} />
        </FixtureWrapper>
    ),
}
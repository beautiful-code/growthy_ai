import { Box, Link } from "@chakra-ui/react"
import { useState } from "react"
import { PublicationSection } from "types"

type Props = {
    publicationSections: PublicationSection[]
}

export const Sections: React.FC<Props> = ({ publicationSections }) => {
    const sectionTitles = publicationSections.map(section => section.sectionTitle)
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0)
    const selectAndScrollToSection = (id: number) => {
        setSelectedSectionIndex(id)
        const element = document.getElementById(String(id));
        element!.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
    };

    return (
        <>
            {sectionTitles.map((sectionTitle, index) => (
                <Box
                    key={index}
                    p={2}
                    borderRadius={"4px"}
                    cursor="pointer"
                    fontSize={"large"}
                    onClick={() => selectAndScrollToSection(index)}
                >
                    <Link
                        color={index === selectedSectionIndex ? "blue" : undefined}
                        textDecoration={index === selectedSectionIndex ? "underline" : "none"}
                    >
                        {sectionTitle}
                    </Link>
                </Box>
            ))}
        </>
    )
}

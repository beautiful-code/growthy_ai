import { RenderSection } from "preview/components/RenderSection"
import { PublicationSection } from "types"
import { FixtureWrapper } from "./FixtureWrapper"
import { Sections } from "preview/components/Sections"
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import { Header } from "common/components/header/Header"
import { FaHome } from "react-icons/fa"

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
            "Dummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4"
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
            <Header>
                    <Flex width="100%" align="center" justifyContent="center">
                        <Box as={FaHome} size="25px" cursor="pointer" onClick={() => {}} ml={[2, 4, 6]} />
                        <Text fontSize="2xl" fontWeight="normal" mx="auto" textAlign="center">
                            {"This is a publication title"}
                        </Text>
                    </Flex>
            </Header>
            <Grid templateColumns={"30% 70%"} mt={"3%"}>
                <GridItem>
                    <Sections publicationSections={publicationSections}/>
                </GridItem>
                <GridItem
                    css={{
                        maxHeight: "calc(100vh - 140px)",
                        overflowY: "auto",
                    }}
                >
                    {publicationSections.map((publicationSection, index) => (
                        <RenderSection publicationSection={publicationSection} sectionIndex={String(index)} key={index}/>
                    ))}
                </GridItem>
            </Grid>
        </FixtureWrapper>
    ),
}
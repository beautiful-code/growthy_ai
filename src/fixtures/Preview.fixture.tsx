import { Sections } from "preview/components/Sections"
import { PublicationSection } from "types"
import { FixtureWrapper } from "./FixtureWrapper"
import { SectionList } from "preview/components/SectionList"
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import { Header } from "common/components/header/Header"
import { FaHome } from "react-icons/fa"

const publicationSections: PublicationSection[] = [
    {
        "sectionTitle": "Introduction to My Sanskrit Journey",
        "sectionContent": "Dummy content 5"
    },
    {
        "sectionTitle": "Discovering The Sanskrit Channel",
        "sectionContent": "Dummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4"
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
                    <SectionList publicationSections={publicationSections}/>
                </GridItem>
                <GridItem
                    css={{
                        maxHeight: "calc(100vh - 140px)",
                        overflowY: "auto",
                    }}
                >
                        <Sections publicationSections={publicationSections} selectedSectionIndex={0} />
                </GridItem>
            </Grid>
        </FixtureWrapper>
    ),
}
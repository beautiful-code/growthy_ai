import { PublicationSection } from "types";
import { FixtureWrapper } from "../../fixtures/FixtureWrapper";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Header } from "common/components/header/Header";
import { FaHome } from "react-icons/fa";
import { SectionList } from "publication/components/SectionList";
import { Sections } from "publication/components/Sections";
import { useState } from "react";

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

export default {
  Basecase: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
    const onSelectionCallback = (id: number) => {
      setSelectedSectionIndex(id);
    };
    return (
      <FixtureWrapper>
        <Header>
          <Flex width="100%" align="center" justifyContent="center">
            <Box
              as={FaHome}
              size="25px"
              cursor="pointer"
              onClick={() => {}}
              ml={[2, 4, 6]}
            />
            <Text
              fontSize="2xl"
              fontWeight="normal"
              mx="auto"
              textAlign="center"
            >
              {"This is a publication title"}
            </Text>
          </Flex>
        </Header>
        <Grid templateColumns={"30% 70%"} mt={"3%"}>
          <GridItem>
            <SectionList
              publicationSections={publicationSections}
              onSelectionCallback={onSelectionCallback}
              selectedSectionIndex={selectedSectionIndex}
            />
          </GridItem>
          <GridItem>
            <Sections
              publicationSections={publicationSections}
              selectedSectionIndex={selectedSectionIndex}
              onTopSectionChange={onSelectionCallback}
            />
          </GridItem>
        </Grid>
      </FixtureWrapper>
    );
  },
};

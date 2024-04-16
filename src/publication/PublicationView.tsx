import { Header } from "common/components/header/Header";
import { Text, Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { useGetExercisePublication } from "./hooks";
import { SkeletonScreen } from "common/components/SkeletonScreen";
import { Sections } from "./components/Sections";
import { SectionList } from "./components/SectionList";
import { useState } from "react";

export const PublicationView: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };

  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);

  const { id: exerciseId } = useParams<string>();
  const { data: exercisePublication, isLoading } = useGetExercisePublication(
    exerciseId!
  );
  const publicationSections = exercisePublication?.sections || [];
  if (isLoading) {
    return <SkeletonScreen />;
  }

  const onSelectionCallback = (sectionIndex: number) => {
    setSelectedSectionIndex(sectionIndex);
  };

  return (
    <Box mt={"20px"} mr={"20px"} mx={"3%"}>
      <Header>
        <Flex width="100%" align="center" justifyContent="center">
          <Box
            as={FaHome}
            size="25px"
            cursor="pointer"
            onClick={handleNavigateHome}
            ml={[2, 4, 6]}
          />
          <Text fontSize="2xl" fontWeight="normal" mx="auto" textAlign="center">
            {exercisePublication?.title}
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
    </Box>
  );
};

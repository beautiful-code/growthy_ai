import { Header } from "common/components/header/Header";
import { Text, Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useParams as useDefaultUseParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { useGetExercisePublication as defaultGetExercisePublication } from "./hooks";
import { SkeletonScreen } from "common/components/SkeletonScreen";
import { SectionList } from "./components/SectionList";
import { useRef, useState } from "react";
import { Sections } from "./components/Sections";
import { ExercisePublication } from "types";
import { useNavigate } from "react-router-dom";

type Props = {
  useGetExercisePublication?: (exerciseId: string) => {data: ExercisePublication | undefined, isLoading: boolean};
  useParams?: () => { id: string };
}

export const PublicationView: React.FC<Props> = ({
  useGetExercisePublication = defaultGetExercisePublication,
  useParams = useDefaultUseParams,
}) => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };

  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const hasUserSelectedSectionRef = useRef<boolean>(false);

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
    hasUserSelectedSectionRef.current = true;
  };

  const onTopSectionChangeCallback = (sectionIndex: number) => {
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
            onTopSectionChangeCallback={onTopSectionChangeCallback}
            hasUserSelectedSectionRef={hasUserSelectedSectionRef}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

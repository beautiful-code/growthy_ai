import { Header } from "common/components/header/Header"
import {
    Text,
    Box,
    Flex,
    Grid,
    GridItem,
  } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { useGetExercisePublication } from "./hooks";
import { Sections } from "./components/SectionList";
import { RenderSection } from "./components/Sections";
import { SkeletonScreen } from "common/components/SkeletonScreen";

export const PreviewView: React.FC = () => {
    const navigate = useNavigate();
    const handleNavigateHome = () => {
        navigate(`/`);
    }

    const {id: exerciseId} = useParams<string>();
    const {data: exercisePublication, isLoading} = useGetExercisePublication(exerciseId!);
    const publicationSections = exercisePublication?.publicationSections || [];
    if (isLoading) {
        return (
          <SkeletonScreen />
        );
    }

    return (
        <Box mt={"20px"} mr={"20px"} mx={"3%"}>
            <Header>
                <Flex width="100%" align="center" justifyContent="center">
                    <Box as={FaHome} size="25px" cursor="pointer" onClick={handleNavigateHome} ml={[2, 4, 6]} />
                    <Text fontSize="2xl" fontWeight="normal" mx="auto" textAlign="center">
                        {exercisePublication?.publicationTitle}
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
        </Box>
    )
}
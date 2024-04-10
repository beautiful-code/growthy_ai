import { Box, Button, Flex, HStack, VStack, Text } from "@chakra-ui/react"
// @ts-expect-error: Svg import
import StudyExerciseIcon from "assets/StudyExerciseIcon.svg?react";
// @ts-expect-error: Svg import
import BlogArticleIcon from "assets/BlogArticleIcon.svg?react";
// @ts-expect-error: Svg import
import TodayILearnedIcon from "assets/TodayILearnedIcon.svg?react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type AddGrowthExerciseProps = {
    createParams: {
        guildId?: string;
        type: "guild-view" | "user-view";
    }
}

export const AddGrowthExercise: React.FC<AddGrowthExerciseProps> = ({createParams: {guildId, type}}) => {
    const [showAddExercise, setShowAddExercise] = useState(false);
    const navigate = useNavigate();

    const handleCreateGE = (exerciseType: "study" | "blog-article" | "til") => {
        if(type === "guild-view") {
            navigate(`/guild/${guildId}/create-growth-exercise/${exerciseType}`);
            return;
        }
        navigate(`/user/create-growth-exercise/${exerciseType}`);
    }

    const handleShowGrowthExercises = () => {
        setShowAddExercise(!showAddExercise);
    };

    return(
        <Box mt={"20px"}>
            <Button
                size="xs"
                ml="8px"
                backgroundColor={"white"}
                color={"primary.500"}
                borderColor={"primary.500"}
                border={"1px solid"}
                onClick={handleShowGrowthExercises}
            >
                Add Growth Exercise, {type}
            </Button>

            {showAddExercise && 
                (<Box mt="15px" border="1px solid" borderColor="gray.300" backgroundColor="gray.200">
                    <VStack align="start" spacing={10} mx="7%" mt="5%" mb="3%">
                        <HStack spacing={["4%", "8%", "12%"]}>
                            <Box
                                as="button"
                                p={6}
                                bg="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                alignItems="center"
                                boxShadow="sm"
                                width={["100%", "45%", "30%"]}
                                height="200px"
                                cursor="pointer"
                                _hover={{ boxShadow: "md" }}
                                onClick={() => handleCreateGE("study")}
                                backgroundColor="gray.200"
                                borderColor="gray.400"
                                mb={["3%", "0"]}
                            >
                                <Flex align="center">
                                    <StudyExerciseIcon w={12} h={12} />
                                    <Text ml="8px" fontSize="lg">
                                        Study Exercise
                                    </Text>
                                </Flex>
                                <Text>Learn by researching and doing</Text>
                                <Text fontSize="sm" color="#006400">Avg Time: 5 hrs</Text>
                            </Box>
                            <Box
                                as="button"
                                p={6}
                                bg="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                alignItems="center"
                                boxShadow="sm"
                                width={["100%", "45%", "30%"]}
                                height="200px"
                                cursor="pointer"
                                _hover={{ boxShadow: "md" }}
                                onClick={() => handleCreateGE("blog-article")}
                                backgroundColor="gray.200"
                                borderColor="gray.400"
                                mb={["3%", "0"]}
                            >
                                <Flex align="center">
                                    <BlogArticleIcon w={12} h={12} />
                                    <Text ml="8px" fontSize="lg">
                                        Blog Article
                                    </Text>
                                </Flex>
                                <Text>Solidify your understanding by writing</Text>
                                <Text fontSize="sm" color="#006400">Avg Time: 1hr</Text>
                            </Box>
                            <Box
                                as="button"
                                p={6}
                                bg="white"
                                borderWidth="1px"
                                borderRadius="lg"
                                alignItems="center"
                                boxShadow="sm"
                                width={["100%", "45%", "30%"]}
                                height="200px"
                                cursor="pointer"
                                _hover={{ boxShadow: "md" }}
                                backgroundColor="gray.200"
                                borderColor="gray.400"
                            >
                                <Flex align="center">
                                    <TodayILearnedIcon w={12} h={12} />
                                    <Text fontSize="lg" mr={"8px"}>
                                        Today I Learned
                                    </Text>
                                </Flex>
                                <Text>Log your day to day learnings</Text>
                                <Text fontSize="sm" color="#006400">Avg Time: 15 mins</Text>
                            </Box>
                        </HStack>
                        <Text fontSize="larger" fontWeight="normal">Not sure what to do. <Text as="span" color="blue">Tell Growthy what's on your mind *</Text></Text>
                    </VStack>
                </Box>
            )}
        </Box>
    )
}
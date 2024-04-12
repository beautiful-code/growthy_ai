import { Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import { useGetCurrentUser } from "./hooks";
import { Sidebar } from "common/components/sidebar/Sidebar";
import { AddGrowthExercise } from "common/components/AddGrowthExercise";
import { Header } from "common/components/header/Header";
import { Exercises } from "common/components/Exercises";
import { getUnpublishedExercisesForUser, getPublishedExercisesForUser } from "./queries";

export const MyGrowthyView: React.FC = () => {
    const { currentUser, isLoading } = useGetCurrentUser()
    const title = currentUser.username && !isLoading ? `${currentUser.username}'s Guild at BeautifulCode` : 'Guild at BeautifulCode'
    
    return (
        <Grid templateColumns={"20% 80%"}  height={"100vh"} overflowY={"auto"}>
            <GridItem>
                <Sidebar />
            </GridItem>

            <GridItem my={"20px"} mx={"5%"} ml={"7%"}>
                <Header>
                    <Text fontSize={"2xl"} fontWeight={"normal"} color={"gray.500"} ml={"15px"}>{title}</Text>
                </Header>
                <AddGrowthExercise createParams={{type: "user-view"}}/>  
                <Grid mt={"4%"}>
                    <VStack align={"start"} spacing={19}>
                        <Exercises title="Currently working on " type={"unpublished"} queryFunction={getUnpublishedExercisesForUser}/>
                        <Exercises title="Publications from the last " defaultDuration={30} type={"published"} queryFunction={getPublishedExercisesForUser}/>
                     </VStack>
                </Grid>
            </GridItem>
        </Grid>
    )
}
import { Grid, GridItem } from "@chakra-ui/react";
import { Sidebar } from "common/components/Sidebar";
import { MenuGrowthExercise } from "common/components/menu/MenuGrowthExercise";
import { useGetExersicesForUser, useGetCurrentUser } from "user/hooks";
import { useGetExercises } from "common/hooks";
import { useState } from "react";
import { GuildAndUserPublications } from "common/components/GuildAndUserPublications";

type Props = object;
export const UserView: React.FC<Props> = () => {
    const currentUser = useGetCurrentUser()
    
    console.log("currentUser", currentUser)
    const handleCreateGE = () => {
        // TODO: Add route to create growth exercise without guild
    }
    
    const title = currentUser.username ? `${currentUser.username}'s Guild at BeautifulCode` : 'Guild at BeautifulCode'
    
    const [exercisesOfUserLoading, setExercisesOfUserLoading] = useState(false);
    const [allExercisesLoading, setAllExercisesLoading] = useState(false);
    
    const allExercises = useGetExercises(setAllExercisesLoading)
    const exercisesOfUser = useGetExersicesForUser(currentUser.id, setExercisesOfUserLoading)
    
    return (
        <Grid templateColumns={"20% 80%"}  height={"100vh"} overflowY={"auto"}>
            <GridItem borderRight="1px solid" borderColor="black.300" backgroundColor={"gray.300"}>
                <Sidebar />
            </GridItem>

            <GridItem my={"20px"} mx={"5%"} ml={"7%"}>
                <MenuGrowthExercise handleCreateGE={handleCreateGE} title={title}/>   
                <Grid mt={"5%"}>
                    <GuildAndUserPublications exercisesOfUserLoading={exercisesOfUserLoading} publicationsLoading={allExercisesLoading} exercisesOfUser={exercisesOfUser} Publications={allExercises}/>        
                </Grid>
            </GridItem>
        </Grid>
    )
}
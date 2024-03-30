import { VStack, Spinner, Text } from "@chakra-ui/react";
import { ExerciseView } from "common/components/ExerciseView";
import { TExercise } from "types";

type Props = {
    exercisesOfUserLoading: boolean;
    publicationsLoading: boolean;
    exercisesOfUser: TExercise[];
    Publications: TExercise[];
}

export const GuildAndUserPublications:React.FC<Props> = ({exercisesOfUserLoading, publicationsLoading, exercisesOfUser, Publications}) => {
    return (
        <>  
            <VStack align={"start"} spacing={5}>
                <Text fontSize="2xl" fontWeight={"normal"} letterSpacing={"wide"}>Currently working on</Text>
                {exercisesOfUserLoading && <Spinner />}
                <VStack align={"start"} spacing={2}>
                    {
                        exercisesOfUser.map((exercise) => {
                            return (
                                <ExerciseView exercise={exercise} key={exercise.id}/>
                            )
                        })
                    }
                </VStack>
                <VStack align={"start"} spacing={5} my={"8%"}>
                    <Text fontSize="2xl" fontWeight={"normal"} >Publications from the last <Text as="span" color={"blue"}>30 days</Text></Text>
                    {publicationsLoading && <Spinner />}
                    <VStack align={"start"} spacing={2}>
                        {
                            Publications.map((guildExercise) => {
                                return (
                                    <ExerciseView exercise={guildExercise} key={guildExercise.id} />
                                )
                            })
                        }
                    </VStack>
                </VStack>
            </VStack>
        </>
    )
}
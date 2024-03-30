import { useState, useEffect } from "react";
import { TExercise } from "types";
import { getExercisesForUser } from "user/queries";

export const useGetExersicesForUser = (userId: string, setLoading: (arg0: boolean) => void ) => {
    const [exercisesOfUser, setExercisesOfUser] = useState<TExercise[]>([]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getExercisesForUser(userId!);
            if(data){
                setExercisesOfUser(data);
            }
            setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
    return exercisesOfUser
}
import { getExercisesForUserInGuild } from "guilds/queries";
import { useEffect, useState } from "react";
import { TExercise } from "types";

export const useGetExerciesForUserInGuild = (guildId: string, setLoading: (arg0: boolean) => void) => {
    const [exercisesOfUser, setExercisesOfUser] = useState<TExercise[]>([]);
    useEffect(() => {
        (async () => {
          setLoading(true);
          const data = await getExercisesForUserInGuild(guildId!);
          if(data){
            setExercisesOfUser(data);
          }
          setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guildId]);
    return exercisesOfUser;
}
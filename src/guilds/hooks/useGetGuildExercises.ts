import { getExercisesForGuild } from "guilds/queries";
import { useState, useEffect } from "react";
import { TExercise } from "types";

export const useGetGuildExercises = (guildId: string, setLoading: (arg0: boolean) => void) => {
    const [guildExercises, setGuildExercises] = useState<TExercise[]>([]);
    useEffect(() => {
        (async () => {
          setLoading(true);
          const allGuildExercises = await getExercisesForGuild(guildId!);
          if(allGuildExercises){
            setGuildExercises(allGuildExercises);
          }
          setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guildId]);
    
    return guildExercises;
}
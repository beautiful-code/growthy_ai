import { getGuildById } from "guilds/queries";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TGuildUser } from "types";

export const useGetGuild = (guildId: string, setLoading: (arg0: boolean) => void) => {
    const [guild, setGuild] = useState<TGuildUser>();

    const { data, isLoading} =  useQuery({queryKey: ["guild", guildId],
        queryFn: () => getGuildById(guildId),
    })
    
    useEffect(() => {
        if(data) {
            setGuild(data);
        }
        setLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return { guild };
};
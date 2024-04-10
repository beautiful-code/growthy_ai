import { getGuildById } from "guilds/queries";
import { useQuery } from "@tanstack/react-query";
import { TGuildUser } from "types";

export const useGetGuild = (guildId: string) => {
    const { data, isLoading} =  useQuery({queryKey: ["guild", guildId],
        queryFn: () => getGuildById(guildId),
    })
    
    return { guild: data as TGuildUser, isLoading };
};
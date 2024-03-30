import { getGuildById } from "guilds/queries";
import { useState, useEffect } from "react";
import { TGuildUser } from "types";

export const useGetGuild = (guildId: string) => {
    const [guild, setGuild] = useState<TGuildUser>();
  
    useEffect(() => {
        (async () => {
            const guild = await getGuildById(guildId)
            if(guild) {
                setGuild(guild);
            }
        })();
    }, [guildId])
  
    return { guild };
};
import { getAllGuilds } from "guilds/queries";
import { useEffect } from "react";
import { useGuildState } from "store";
import { TGuild } from "types";

export const useGetGuilds = () => {
  const [guilds, handleSetGuilds] = useGuildState();
  useEffect(() => {
    getAllGuilds()
      .then((newGuilds) => {
        handleSetGuilds(newGuilds);
      }).catch((error) => {
        console.error("Error fetching guilds: ", error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return guilds as TGuild[];
};
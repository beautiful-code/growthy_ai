import { getAllGuilds } from "guilds/queries";
import { useQuery } from "@tanstack/react-query";
import { TGuildUser } from "types";

export const useGetGuilds = () => {
  const {data, isLoading} =  useQuery({queryKey: ["guilds"], 
    queryFn: () => getAllGuilds(),
  })
  
  return {guilds: data?.guilds as TGuildUser[], isLoading};
};
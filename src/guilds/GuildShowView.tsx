import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  GridItem,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";

import { Sidebar } from "common/components/Sidebar";
import { UserAvatar } from "common/components/menu/UserAvatar";
import { useGetGuild, useGetExerciesForUserInGuild, useGetGuildExercises } from "guilds/hooks";
import { MenuGrowthExercise } from "common/components/menu/MenuGrowthExercise";
import { GuildAndUserPublications } from "common/components/GuildAndUserPublications";

type Props = object;

export const GuildShowView: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCreateGE = (type: "study" | "blog-article" | "til") => {
    navigate(`/guild/${id}/create-growth-exercise/${type}`);
  };

  const { guild } = useGetGuild(id!);
  const [exercisesOfUserLoading, setExercisesOfUserLoading] = useState(false);
  const [guildExercisesLoading, setGuildExercisesLoading] = useState(false);
  
  const exercisesOfUser = useGetExerciesForUserInGuild(id!, setExercisesOfUserLoading);
  const guildExercises = useGetGuildExercises(id!, setGuildExercisesLoading);
  const title = guild?.name ? `${guild.name} Guild at BeautifulCode` : 'Guild at BeautifulCode'
  return (
    <Grid templateColumns={"20% 80%"}  height={"100vh"} overflowY={"auto"}>
      <GridItem borderRight="1px solid" borderColor="black.300" backgroundColor={"gray.300"}>
        <Sidebar />
      </GridItem>

      <GridItem my={"20px"} mx={"5%"} ml={"7%"}>
        <MenuGrowthExercise handleCreateGE={handleCreateGE} title={title} guild={guild}/>
        <Grid templateColumns={"75% 25%"} mt={"5%"}>
          <GridItem>
            <GuildAndUserPublications exercisesOfUserLoading={exercisesOfUserLoading} publicationsLoading={guildExercisesLoading} exercisesOfUser={exercisesOfUser} Publications={guildExercises}/>
          </GridItem>

          <GridItem border={"1px solid"} borderColor={"gray.300"} backgroundColor={"gray.200"} height={"400px"}>
            <VStack align={"start"} spacing={4} ml={"15px"}>
              <Text fontSize="2xl" fontWeight={"normal"}>Members</Text>
              <HStack spacing={4}>
                {guild?.user && 
                  <>
                    <UserAvatar avatarUrl={guild.user.avatar_url} size="sm"/>
                    <Text fontSize="larger" fontWeight={"normal"}> {guild.user.username} - Lead </Text>
                  </>
                }
              </HStack>
            </VStack>
          </GridItem> 
        </Grid>

      </GridItem>
    </Grid>
  );
};

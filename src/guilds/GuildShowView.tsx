import React from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  GridItem,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Sidebar } from "common/components/sidebar/Sidebar";
import { GuildMembers } from "./components/GuildMembers";
import { AddGrowthExercise } from "common/components/AddGrowthExercise";
import { useGetGuild } from "./hooks";
import { Header } from "common/components/header/Header";
import { GuildIcon } from "common/components/GuildIcon";
import { Exercises } from "common/components/Exercises";
import { getPublishedExercisesInGuild, getUnpublishedExercisesInGuild } from "./queries";

export const GuildShowView: React.FC = () => {
  const { id: guildId } = useParams();
  const { guild } = useGetGuild(guildId!);
  const title = guild?.name ? `${guild.name} Guild at BeautifulCode` : 'Guild at BeautifulCode'

  return (
    <>
      <Grid templateColumns={"20% 80%"}  height={"100vh"} overflowY={"auto"}>
        <GridItem>
          <Sidebar selectedGuildId={guildId}/>
        </GridItem>

        <GridItem my={"20px"} mx={"5%"} ml={"7%"}>
          <Header>
            <GuildIcon guild={guild}/>
            <Text fontSize={"2xl"} fontWeight={"normal"} color={"gray.500"} ml={"15px"}>{title}</Text>
          </Header>
          <AddGrowthExercise createParams={{guildId: guildId, type: "guild-view"}}/>
          <Grid templateColumns={"75% 25%"} mt={"4%"}>
            <GridItem>
              <VStack align={"start"} spacing={20}>
                <Exercises title="Currently working on " type={"unpublished"} queryFunction={getUnpublishedExercisesInGuild} guildId={guildId}/>
                <Exercises title="Publications from the last " defaultDuration={30} type={"published"} queryFunction={getPublishedExercisesInGuild} guildId={guildId}/>
              </VStack>
            </GridItem>

            <GridItem border={"1px solid"} borderColor={"gray.300"} backgroundColor={"gray.200"} height={"400px"}>
              <VStack align={"start"} spacing={4} ml={"15px"}>
                <GuildMembers guildUser={guild!}/>
              </VStack>
            </GridItem> 
          </Grid>

        </GridItem>
      </Grid>
    </>

  );
};

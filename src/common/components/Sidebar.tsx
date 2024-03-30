import { Box , HStack, Heading, VStack, Text, Link } from "@chakra-ui/react";
import React from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";
import { TGuild } from "types";
import { GuildIcon } from "common/components/GuildIcon";
import { useGetGuilds } from "guilds/hooks/useGetGuilds";

type TSideBarProps = object;

const GuildBox: React.FC<{guild: TGuild}> = ({guild}) => {
  
  const navigate = useNavigate();
  const handleNavigateGuild = (guildId: string) => {
    navigate(`/guild/${guildId}`);
  } 

  return (
    <HStack spacing={4}>
      <GuildIcon guild={guild} />
      <Link
        fontWeight={"bold"}
        fontSize={"lg"}
        _hover={{ textDecoration: "none" }}
        onClick={() => handleNavigateGuild(guild.id)}
      >
        {guild.name}
      </Link>
    </HStack>
  )
}

export const Sidebar: React.FC<TSideBarProps> = () => {
  const navigate = useNavigate();
  
  const handleNavigateHome = () => {
    navigate(`/`);
  }

  const handleNavigateUserView = () => {
    navigate(`/user`);
  }

  const guilds = useGetGuilds();

  return (
    <Box mt={"27px"}>
      <VStack align="start" spacing={4} mx={"10%"} mr={"20%"}>
        <HStack spacing={4}>
          <FaHome size={20} cursor="pointer" onClick={handleNavigateHome}> </FaHome>  
          <Heading size={"md"} fontWeight={"normal"}> Home </Heading>
        </HStack>
        <span
          style={{
            width: "100%",
            height: "2px",
            marginTop: "4px",
            marginBottom: "4px",
            backgroundColor: "gray",
          }}
        />
        <Text fontWeight={"bold"} fontSize={"xl"}>Guilds</Text>
          <VStack spacing={2} align={"start"}>  
            {guilds.map((guild: TGuild) => {
              return (
                <GuildBox
                  key={guild.id}
                  guild={guild}
                />
              )
            })}
          </VStack>
        <span
          style={{
            width: "100%",
            height: "2px",
            marginTop: "4px",
            marginBottom: "4px",
            backgroundColor: "gray",
          }}
        />
        <HStack spacing={4}>
          <GrowthyOval width={25} height={25} />
          <Link fontWeight={"bold"} fontSize={"xl"} _hover={{ textDecoration: "none" }} onClick={handleNavigateUserView}> {"My Growth"} </Link>
        </HStack>
      </VStack>
    </Box>
  )
};

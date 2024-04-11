import { Box , HStack, Heading, VStack, Text, Link, Grid, Spinner } from "@chakra-ui/react";
import React from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";
import { TGuild } from "types";
import { useGetGuilds } from "guilds/hooks/useGetGuilds";
import { GuildBox } from "./GuildBox";

type TSideBarProps = {
  selectedGuildId?: string;
};

export const Sidebar: React.FC<TSideBarProps> = ({selectedGuildId}) => {
  const navigate = useNavigate();
  
  const handleNavigateHome = () => {
    navigate(`/`);
  }

  const handleNavigateMyGrowthyView = () => {
    navigate(`/my-growthy`);
  }

  const {guilds, isLoading} = useGetGuilds();

  return (
    <>  
      <Grid borderRight="1px solid" borderColor="black.300" backgroundColor={"gray.300"} height={"100%"} overflowY={"auto"}>
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
              {isLoading ? <Spinner /> :
              <VStack spacing={2} align={"start"}>  
                {guilds.map((guild: TGuild) => {
                  return (
                    <GuildBox
                      key={guild.id}
                      guild={guild}
                      selectedGuildId={selectedGuildId}
                    />
                  )
                })}
              </VStack>}
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
              <Link 
                fontWeight={"bold"} 
                fontSize={"xl"} 
                _hover={{ textDecoration: "none" }}
                onClick={handleNavigateMyGrowthyView}
                color={window.location.pathname.includes("/my-growthy") ? "blue" : ""}
              > 
                My Growth
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Grid>
    </>
  )
};

import React from "react";
import { Grid, GridItem, Text } from "@chakra-ui/react";
import { Sidebar } from "common/components/sidebar/Sidebar";
import { Exercises } from "common/components/Exercises";
import { Header } from "common/components/header/Header";
import { getExercisesPaginated } from "./queries";

export const HomeView: React.FC = () => {
  return (
    <Grid templateColumns={"20% 80%"} height={"100vh"}>
      <GridItem>
        <Sidebar />
      </GridItem>

      <GridItem  my={"20px"} mx={"5%"} ml={"7%"}>
          <Header>
            <Text fontWeight={"normal"} fontSize={"2xl"} color={"gray.500"}>Growthy at BeautifulCode</Text>
          </Header>
          <Exercises  title="Publications from the last " defaultDuration={30} type={"published"} queryFunction={getExercisesPaginated}/>
      </GridItem>
    </Grid>
  );
};

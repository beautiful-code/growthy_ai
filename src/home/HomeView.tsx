import React from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";

import { Sidebar } from "common/components/Sidebar";
import { ExercisesListView } from "./components";
import { MenuWrapper } from "common/components/menu/MenuWrapper";

export const HomeView: React.FC = () => {
  return (
    <Grid templateColumns={"20% 80%"} height={"100vh"}>
      <GridItem borderRight="1px solid" borderColor="black.300" backgroundColor={"gray.300"}>
        <Sidebar />
      </GridItem>

      <GridItem>
        <Box mx={"5%"} ml={"7%"}>
          <MenuWrapper>
            <ExercisesListView />
          </MenuWrapper>
        </Box>
      </GridItem>
    </Grid>
  );
};

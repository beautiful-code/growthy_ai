import React from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";

import { Sidebar } from "common/components/Sidebar";
import { Menu } from "common/components/menu/Menu";
import { ExercisesListView } from "./components";

export const Home: React.FC = () => {
  return (
    <Box>
      <Menu title={""} />

      <Box>
        <Grid templateColumns={"30% 70%"}>
          <GridItem>
            <Sidebar />
          </GridItem>

          <GridItem>
            <ExercisesListView />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

import React from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { UserAvatar } from "common/components/header/UserAvatar";
import { NavMenu } from "common/components/header/NavMenu";

type HeaderProps = {
  children: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <Grid templateColumns="90% 10%">
      <GridItem colSpan={1}>
        <Flex height="100%" justify={"flex-start"} align="center">
          {children}
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex mr={"20px"} justify={"flex-end"} align="center">
            <UserAvatar />
            <NavMenu />
        </Flex>
      </GridItem>
    </Grid>
  );
};

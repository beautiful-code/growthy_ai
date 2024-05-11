import React from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { UserAvatar } from "common/components/header/UserAvatar";
import { NavMenu } from "common/components/header/NavMenu";

type HeaderProps = {
  children: React.ReactNode;
  showAvatar?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  children,
  showAvatar = true,
}) => {
  return (
    <Grid templateColumns="2fr auto">
      <GridItem colSpan={1}>
        <Flex height="100%" justify={"flex-start"} align="center">
          {children}
        </Flex>
      </GridItem>
      {showAvatar && (
        <GridItem colSpan={1}>
          <Flex mr={"20px"} justify={"flex-end"} align="center">
            <UserAvatar />
            <NavMenu />
          </Flex>
        </GridItem>
      )}
    </Grid>
  );
};

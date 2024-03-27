import React, { ReactNode } from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { UserAvatar, NavMenu } from "components";
import { useNavigate } from "react-router-dom";

type MenuProps = {
  title: ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ title }) => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };

  return (
    <Grid templateColumns="70% 30%">
      <GridItem colSpan={1}>
        <Flex height="100%" justify={"flex-start"} align="center">
          {title}
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex mr={"20%"} justify={"flex-end"} align="center">
          <div onClick={handleNavigateHome}>
            <UserAvatar />
          </div>
          <NavMenu />
        </Flex>
      </GridItem>
    </Grid>
  );
};

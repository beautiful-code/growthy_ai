import React from "react";
import { Box, Flex } from "@chakra-ui/react";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";
// @ts-expect-error: Svg import
import Hamburger from "assets/Hamburger.svg?react";

type Props = {
  handleGrowthyAIDrawerType: (
    type: "growthy-conversation" | "generate-content" | ""
  ) => void;
};

export const Actions: React.FC<Props> = ({ handleGrowthyAIDrawerType }) => {
  return (
    <Flex mt={"16px"} justify={"flex-end"} mr={"32px"}>
      <Hamburger
        cursor="pointer"
        onClick={() => handleGrowthyAIDrawerType("generate-content")}
      />
      <Box ml={"16px"}>
        <GrowthyOval
          cursor="pointer"
          onClick={() => handleGrowthyAIDrawerType("growthy-conversation")}
        />
      </Box>
    </Flex>
  );
};

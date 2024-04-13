import React from "react";
import { Box, Text, CloseButton, Flex } from "@chakra-ui/react";

// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";

type Props = {
  onClose: () => void;
};

export const DefaultHelperNote: React.FC<Props> = ({ onClose }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      bg="gray.100"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.300"
    >
      <Box>
        <Box>
          <Text fontSize="sm" color="gray.800">
            This is a place to jot down your thoughts.
          </Text>
          <Text fontSize="sm" color="gray.800">
            Write down your talking points or anything that's on your mind
          </Text>
        </Box>
        <Flex>
          If you need help click on the <GrowthyOval /> icon on the right
        </Flex>
      </Box>
      <CloseButton onClick={onClose} />
    </Box>
  );
};

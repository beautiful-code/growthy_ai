import { useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { TExecutionModes } from "types";

export type ToggleModeProps = {
  mode: TExecutionModes;
  setMode?: React.Dispatch<React.SetStateAction<TExecutionModes>>;
};

export const ToggleMode: React.FC<ToggleModeProps> = ({ mode, setMode }) => {
  const [selectedMode, setSelectedMode] = useState(mode);

  const inactiveBg = "gray.200";
  const activeBg = "green.500";
  const activeColor = "white";

  const handleModeChange = (mode: Props["mode"]) => {
    setSelectedMode(mode);
    if (setMode) {
      setMode(mode);
    }
  };

  const modes: TExecutionModes[] = ["Outline", "Notes", "Publish"];

  return (
    <Flex
      alignItems="center"
      bg={inactiveBg}
      borderRadius="full"
      w="250px"
      p="2px"
      h={"40px"}
      justify="space-between"
    >
      {modes.map((mode) => (
        <Button
          key={mode}
          flex="1"
          bg={selectedMode === mode ? activeBg : "transparent"}
          color={selectedMode === mode ? activeColor : "inherit"}
          borderRadius="full"
          onClick={() => handleModeChange(mode)}
          justifyContent="center"
          h={"100%"}
          fontSize={"sm"}
          _hover={{ bg: selectedMode === mode ? activeBg : "gray.300" }}
        >
          <Text>{mode}</Text>
        </Button>
      ))}
    </Flex>
  );
};

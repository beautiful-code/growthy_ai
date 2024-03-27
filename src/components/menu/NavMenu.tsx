import React from "react";
import {
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Switch,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useExperienceSettingsState } from "store";
import { FaEllipsisVertical } from "react-icons/fa6";

import { supabaseClient } from "supabaseClient";

export const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const [experienceSettings, setExperienceSettings] =
    useExperienceSettingsState();

  const handleChangeExperienceSettings = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExperienceSettings({
      ...experienceSettings,
      userFontSize: e.target.checked ? "small" : "big",
    });
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    navigate("/login");
  };

  return (
    <Box ml={4}>
      <Menu>
        <MenuButton>
          <FaEllipsisVertical />
        </MenuButton>
        <MenuList p={4}>
          <Stack spacing={1}>
            <Text>Experience Settings</Text>

            <Flex width={"100%"} justify={"space-between"} align="center">
              <Text>Small Text</Text>
              <Switch
                isChecked={experienceSettings?.userFontSize === "small"}
                onChange={handleChangeExperienceSettings}
              />
            </Flex>

            <Box cursor={"pointer"} onClick={logout}>
              <Text>Log out</Text>
            </Box>
          </Stack>
        </MenuList>
      </Menu>
    </Box>
  );
};

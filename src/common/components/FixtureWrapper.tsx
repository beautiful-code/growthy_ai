import React from "react";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "login/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { getChakraUIExtendedTheme } from "common/utils";

type Props = {
  children: React.ReactNode;
};

export const FixtureWrapper: React.FC<Props> = ({ children }) => {
  const extendedThemeObj = extendTheme(getChakraUIExtendedTheme(false));

  return (
    <RecoilRoot>
      <AuthProvider>
        <ChakraProvider theme={extendedThemeObj}>
          <BrowserRouter>{children}</BrowserRouter>
        </ChakraProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

import React from "react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "login/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { getChakraUIExtendedTheme } from "common/utils";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const FixtureWrapper: React.FC<Props> = ({ children }) => {
  const extendedThemeObj = extendTheme(getChakraUIExtendedTheme(false));

  return (
    <RecoilRoot>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={extendedThemeObj}>
            <BrowserRouter>{children}</BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

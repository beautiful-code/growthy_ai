import React from "react";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "login/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getChakraUIExtendedTheme } from "common/utils";

type Props = {
  children: React.ReactNode;
};

export const FixtureWrapper: React.FC<Props> = ({ children }) => {
  const extendedThemeObj = extendTheme(getChakraUIExtendedTheme(false));
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AuthProvider>
          <ChakraProvider theme={extendedThemeObj}>
            <BrowserRouter>{children}</BrowserRouter>
          </ChakraProvider>
        </AuthProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

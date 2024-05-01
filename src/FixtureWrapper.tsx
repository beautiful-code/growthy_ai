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
      <AuthProvider
        isFromFixture={true}
        defaultValue={{
          session: {
            user: {
              email: "",
              id: "123",
              user_metadata: {
                avatar_url:
                  "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
                full_name: "Test User",
              },
              aud: "supabase",
              app_metadata: {
                provider: "email",
              },
              created_at: "2021-09-29T17:00:00.000Z",
            },
            access_token: "123",
            expires_in: 3600,
            refresh_token: "123",
            token_type: "Bearer",
            provider_token: "123",
          },
          isAuthenticated: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={extendedThemeObj}>
            <BrowserRouter>{children}</BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

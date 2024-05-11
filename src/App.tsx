import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "login/context/AuthContext";
import { HomeView } from "home/HomeView";
import { GuildShowView } from "guilds/GuildShowView";
import { CreateGrowthExerciseView } from "growth-exercise/CreateGrowthExerciseView";
import { ExecuteView } from "execute/ExecuteView";
import { LoginView } from "login/LoginView";
import { useExperienceSettingsState } from "store";
import { getChakraUIExtendedTheme } from "common/utils";

import "App.css";
import "main.css";
import { MyGrowthyView } from "my-growthy/MyGrowthyView";
import { PublicationView } from "publication/PublicationView";
import { ModifyOutline } from "common/components/outline/ModifyOutline";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/guild/:id",
    element: <GuildShowView />,
  },
  {
    path: "/guild/:guildId/create-growth-exercise/:type",
    element: <CreateGrowthExerciseView />,
  },
  {
    path: "/user/create-growth-exercise/:type",
    element: <CreateGrowthExerciseView />,
  },
  {
    path: "/guild/:id/create-growth-exercise/:type",
    element: <CreateGrowthExerciseView />,
  },
  {
    path: "/execute/:growthExerciseId",
    element: <ExecuteView />,
  },
  {
    path: "/execute/:growthExerciseId/modify-outline",
    element: <ModifyOutline />,
  },
  {
    path: "/my-growthy",
    element: <MyGrowthyView />,
  },
  {
    path: "/preview/:id",
    element: <PublicationView />,
  },
]);

const queryClient = new QueryClient();

function App() {
  const [experienceSettings] = useExperienceSettingsState();

  const isSmallFont = experienceSettings.userFontSize === "small";

  const extendedThemeObj = getChakraUIExtendedTheme(isSmallFont);

  const extendedTheme = extendTheme(extendedThemeObj);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={extendedTheme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "login/context/AuthContext";
import { Home } from "home/HomeView";
import { GuildShowView } from "guilds/GuildShowView";
import { CreateGrowthExerciseView } from "growth-exercise/CreateGrowthExerciseView";
import { ExecuteView } from "execute/ExecuteView";
import { LoginView } from "login/LoginView";
import { useExperienceSettingsState } from "store";
import { getChakraUIExtendedTheme } from "common/utils";

import "App.css";
import "main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/guild/:id/create-growth-exercise/:type",
    element: <CreateGrowthExerciseView />,
  },
  {
    path: "/:growthExerciseId/execute",
    element: <ExecuteView />,
  },
]);

function App() {
  const [experienceSettings] = useExperienceSettingsState();

  const isSmallFont = experienceSettings.userFontSize === "small";

  const extendedThemeObj = getChakraUIExtendedTheme(isSmallFont);

  const extendedTheme = extendTheme(extendedThemeObj);

  return (
    <AuthProvider>
      <ChakraProvider theme={extendedTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

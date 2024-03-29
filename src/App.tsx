import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "login/context/AuthContext";
import { Home } from "home/HomeView";
import { GuildShowView } from "guilds/GuildShowView";
// import { CreateGrowthExerciseView } from "growth-exercise/CreateGrowthExerciseView";
import { LoginView } from "login/LoginView";
import { useExperienceSettingsState } from "store";

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
  // {
  //   path: "/guild/:id/create-growth-exercise/:type",
  //   element: <CreateGrowthExerciseView />,
  // },
]);

function App() {
  const [experienceSettings] = useExperienceSettingsState();

  const isSmallFont = experienceSettings.userFontSize === "small";

  const extendedTheme = extendTheme({
    colors: {
      primary: {
        50: "#0B870B",
        100: "#0B870B",
        500: "#0B870B",
      },
      link: "#0D2C9C",
      secondary: "#D2D2D2",
      secondaryDark: "#7E7E7E",
    },
    fontSizes: {
      xs: isSmallFont ? "0.75rem" : "0.875rem",
      sm: isSmallFont ? "0.875rem" : "1rem",
      md: isSmallFont ? "1rem" : "1.125rem",
      lg: isSmallFont ? "1.125rem" : "1.25rem",
      xl: isSmallFont ? "1.25rem" : "1.5rem",
      "2xl": isSmallFont ? "1.5rem" : "1.875rem",
      "3xl": isSmallFont ? "1.875rem" : "2.25rem",
      "4xl": isSmallFont ? "2.25rem" : "3rem",
      "5xl": isSmallFont ? "3rem" : "3.75rem",
      "6xl": isSmallFont ? "3.75rem" : "4.5rem",
      "7xl": isSmallFont ? "4.5rem" : "6rem",
      "8xl": isSmallFont ? "6rem" : "8rem",
      "9xl": isSmallFont ? "8rem" : "10rem",
      "xx-small": isSmallFont ? "0.625rem" : "0.75rem",
      "x-small": isSmallFont ? "0.75rem" : "0.875rem",
      smaller: isSmallFont ? "0.75rem" : "0.875rem",
      small: isSmallFont ? "0.875rem" : "1rem",
      medium: isSmallFont ? "1rem" : "1.125rem",
      large: isSmallFont ? "1.125rem" : "1.25rem",
      larger: isSmallFont ? "1.25rem" : "1.5rem",
      "x-large": isSmallFont ? "1.25rem" : "1.5rem",
      "xx-large": isSmallFont ? "1.5rem" : "1.875rem",
      "xxx-large": isSmallFont ? "1.875rem" : "2.25rem",
    },
    input: {
      fontSize: isSmallFont ? "0.875rem" : "1rem",
    },
  });

  return (
    <AuthProvider>
      <ChakraProvider theme={extendedTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

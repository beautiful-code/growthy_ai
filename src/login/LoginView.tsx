import React from "react";
import { Button, Center, VStack, Box, Heading } from "@chakra-ui/react";

import { supabaseClient } from "supabaseClient";

type Props = {};

export const LoginView: React.FC<Props> = () => {
  async function signInWithGoogle() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
      return null;
    }

    return { data };
  }

  return (
    <Center h="100vh" bg="#F0FAF0B2">
      <Box
        w="sm" // Set the width of the Box
        p={8} // Padding inside the Box
        boxShadow="md" // Medium shadow to give a card-like appearance
        borderRadius="lg" // Slightly rounded corners for the Box
        bg="white" // Background color of the Box
      >
        <VStack spacing={4}>
          {" "}
          {/* Adjust spacing as needed */}
          <Heading as="h1" size="xl">
            Growthy
          </Heading>
          <Button
            _hover={{ bg: "#0b870b82" }}
            bg="#0b870b"
            color="white"
            size="lg"
            onClick={signInWithGoogle}
          >
            Login with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

import React, { Component, ReactNode } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  handleReRender: () => void;
  children: ReactNode;
}

export class MarkdownErrorBoundry extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRefresh = () => {
    this.props.handleReRender();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box backgroundColor="#FF638440" p={"16px"} mt="8px">
          <Text display={"block"} my="16px" fontSize={"large"}>
            The language you tried was not available
          </Text>

          <Text display={"block"} my="16px">
            Please try a different language, the available languages are -
          </Text>
          <Box>
            {[
              "javascript",
              "typescript",
              "css",
              "html",
              "go",
              "python",
              "java",
              "ruby",
              "yaml",
              "sh",
            ]?.map((lang) => (
              <Text display={"block"} key={lang}>
                {lang}
              </Text>
            ))}
          </Box>

          <Flex justify={"center"}>
            <Button onClick={this.handleRefresh}>Refresh</Button>
          </Flex>
        </Box>
      );
    }

    return this.props.children;
  }
}

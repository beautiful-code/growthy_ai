import React from "react";
import { Button } from "@chakra-ui/react";

export type GButtonProps = {
  type?: "primary" | "secondary";
  htmlType?: "button" | "submit" | "reset";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  onClick?: () => void;
  children?: React.ReactNode;
  [key: string]: any;
};

export const GButton: React.FC<GButtonProps> = ({
  type = "primary",
  htmlType,
  size = "md",
  onClick = () => {},
  children,
  ...props
}) => {
  const isSecondary = type === "secondary";
  return (
    <Button
      {...props}
      type={htmlType}
      size={size}
      border={isSecondary ? "1px solid #0b870b" : "none"}
      backgroundColor={isSecondary ? "white" : "primary.500"}
      color={isSecondary ? "primary.500" : "white"}
      _hover={
        isSecondary
          ? {
              backgroundColor: "primary.500",
              color: "white",
            }
          : {
              backgroundColor: "primary.600",
            }
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

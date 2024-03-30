import React, { useState, ReactNode } from "react";
import { Box } from "@chakra-ui/react";

import { Menu } from "./Menu";

type MenuWrapperProps = {
  children: ReactNode;
};

export const MenuWrapper: React.FC<MenuWrapperProps> = ({ children }) => {
  const [title, setTitle] = useState<ReactNode>("");

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      return React.cloneElement(child, {
        ...child.props,
        title,
        setTitle,
      } as Partial<unknown> & React.Attributes);
    });
  };

  return (
    <Box>
      <Box my={"20px"}>
        <Menu title={title} />
      </Box>
      {renderChildren()}
    </Box>
  );
};

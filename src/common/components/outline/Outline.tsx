import React from "react";
import { Accordion, Box, Flex, Button } from "@chakra-ui/react";

import { UIOutline } from "domain/blog-article/UIOutline";
import { UISection } from "domain/blog-article/UISection";
import { Section } from "./Section";
import { domainUpdateAndCallback } from "common/utils";

type Props = {
  uiOutline: UIOutline;
  onUpdateOutlineCallback: (uiOutline: UIOutline) => void;
};

export const Outline: React.FC<Props> = ({
  uiOutline,
  onUpdateOutlineCallback,
}) => {
  const handleExpandAll = () => {
    uiOutline.expandAllSections();
    onUpdateOutlineCallback(uiOutline);
  };

  const handleCollapseAll = () => {
    uiOutline.collapseAllSections();
    onUpdateOutlineCallback(uiOutline);
  };

  const onUpdateSectionCallback =
    (sectionIndex: number) => (uiSection: UISection) => {
      domainUpdateAndCallback(
        uiOutline,
        "updateSection",
        [sectionIndex, uiSection],
        onUpdateOutlineCallback
      );
    };

  return (
    <Box>
      <Accordion
        allowMultiple
        allowToggle
        index={uiOutline.getExpandesSectionIndices()}
      >
        {uiOutline.getSections().map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            uiSection={section}
            onUpdateSectionCallback={onUpdateSectionCallback(sectionIndex)}
          />
        ))}
      </Accordion>

      <Flex justify={"flex-end"}>
        <Button
          size="xs"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleExpandAll}
        >
          Expand all
        </Button>
        <Button
          size="xs"
          ml="8px"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleCollapseAll}
        >
          Collapse all
        </Button>
      </Flex>
    </Box>
  );
};

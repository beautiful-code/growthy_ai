import React, { useState, useEffect } from "react";
import { Accordion, Box, Flex, Button } from "@chakra-ui/react";

import { Section } from "common/components/outline/Section";
import { SectionV2 as TSectionV2 } from "types";

type Props = {
  defaultSections?: TSectionV2[];
  defaultExpandedSectionIndices?: number[];
  checkingDisabled?: boolean;
};

export const Outline: React.FC<Props> = ({
  defaultSections = [],
  defaultExpandedSectionIndices = [],
  checkingDisabled = false,
}) => {
  const [sections, setSections] = useState<TSectionV2[]>(defaultSections);

  const [expandedSectionIndices, setExpandedSectionIndices] = useState<
    number[]
  >(defaultExpandedSectionIndices);

  useEffect(() => {
    setSections(defaultSections);
  }, [defaultSections]);

  const handleExpandAll = () => {
    setExpandedSectionIndices(sections?.map((_, index) => index));
  };

  const handleCollapseAll = () => {
    setExpandedSectionIndices([]);
  };

  return (
    <Box>
      <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
        {sections.map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            sectionIndex={sectionIndex}
            section={section}
            checkingDisabled={checkingDisabled}
            setSections={setSections}
            setExpandedSectionIndices={setExpandedSectionIndices}
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

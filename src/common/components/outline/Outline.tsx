import React from "react";
import { Accordion, Box, Flex } from "@chakra-ui/react";
import { GButton } from "common/components/GButton";

import { UIOutline } from "domain/common/UIOutline";
import { UISection } from "domain/common/UISection";
import { Section } from "./Section";
import { domainUpdateAndCallback } from "common/utils";

type Props = {
  uiOutline: UIOutline | null;
  checkingEnabled?: boolean;
  taskSelectionEnabled?: boolean;
  onUpdateOutlineCallback: (uiOutline: UIOutline) => void;
};

export const Outline: React.FC<Props> = ({
  uiOutline,
  checkingEnabled = false,
  taskSelectionEnabled = false,
  onUpdateOutlineCallback,
}) => {
  if (!uiOutline) {
    return null;
  }

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

  const handleSelectTask = (taskId: string) => {
    domainUpdateAndCallback(
      uiOutline,
      "selectTask",
      [taskId],
      onUpdateOutlineCallback
    );
  };

  return (
    <Box>
      <Accordion allowMultiple index={uiOutline.getExpandesSectionIndices()}>
        {uiOutline.getSections().map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            uiSection={section}
            checkingEnabled={checkingEnabled}
            taskSelectionEnabled={taskSelectionEnabled}
            onUpdateSectionCallback={onUpdateSectionCallback(sectionIndex)}
            handleSelectTask={handleSelectTask}
          />
        ))}
      </Accordion>

      <Flex justify={"flex-end"}>
        <GButton size="xs" type="secondary" onClick={handleExpandAll}>
          Expand all
        </GButton>
        <GButton size="xs" type="secondary" onClick={handleCollapseAll}>
          Collapse all
        </GButton>
      </Flex>
    </Box>
  );
};

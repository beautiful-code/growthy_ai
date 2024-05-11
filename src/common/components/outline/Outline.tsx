import React from "react";
import { Accordion, Box, Flex, Link } from "@chakra-ui/react";
import { GButton } from "common/components/GButton";

import { UIOutline } from "domain/common/UIOutline";
import { UISection } from "domain/common/UISection";
import { Section } from "./Section";
import { domainUpdateAndCallback } from "common/utils";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type Props = {
  uiOutline: UIOutline | null;
  checkingEnabled?: boolean;
  taskSelectionEnabled?: boolean;
  onUpdateOutlineCallback: (uiOutline: UIOutline) => void;
  allowOutlineChanges?: boolean;
  alwaysExpand?: boolean;
  allowExpand?: boolean;
};

export const Outline: React.FC<Props> = ({
  uiOutline,
  checkingEnabled = false,
  taskSelectionEnabled = false,
  onUpdateOutlineCallback,
  allowOutlineChanges = false,
  alwaysExpand = false,
  allowExpand = true,
}) => {
  const navigate = useNavigate();

  const handleNavigateToModifyOutline = () => {
    navigate('modify-outline');  
  };

  if (!uiOutline) {
    return null;
  }

  if (alwaysExpand) {
    uiOutline.expandAllSections();
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

      {allowExpand && (
        <Flex justifyContent={"flex-end"} mr={"10px"} mt={"20px"}>
          <GButton size="xs" type="secondary" onClick={handleExpandAll}>
            Expand all
          </GButton>
          <GButton
            size="xs"
            type="secondary"
            onClick={handleCollapseAll}
            ml={"10px"}
          >
            Collapse all
          </GButton>
        </Flex>
      )}

      {allowOutlineChanges && (
        <Flex align={"center"} p={1} cursor={"pointer"} mt={"30px"} ml={"20px"} pb={"80px"}>
          <MdEdit color="blue" />{" "}
          <Link
            ml="8px"
            color={"blue"}
            cursor={"pointer"}
            _hover={{ textDecoration: "none" }}
            onClick={handleNavigateToModifyOutline}
          >
            Make changes to the outline
          </Link>
        </Flex>
      )}
    </Box>
  );
};

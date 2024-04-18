import { useState } from "react";
import { Box, Accordion } from "@chakra-ui/react";
import { Section } from "common/components/outline/Section";
import { UISection } from "domain/common/UISection";
import { FixtureWrapper } from "FixtureWrapper";

export default {
  "base case": () => {
    const [sectionXml, setSectionXml] = useState(
      "<Section name='section1'><Task name='task1' /><Task name='task2' /></Section>"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Accordion allowToggle allowMultiple>
            <Section
              uiSection={new UISection(sectionXml)}
              onUpdateSectionCallback={(uiSection) => {
                console.log("onUpdateSectionCallback called");
                setSectionXml(uiSection._xml);
              }}
            />
          </Accordion>
        </FixtureWrapper>
      </Box>
    );
  },
};

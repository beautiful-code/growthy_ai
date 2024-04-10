import { useState } from "react";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box } from "@chakra-ui/react";
import { Section } from "common/components/outline/Section";
import { UISection } from "domain/common/UISection";

export default {
  "base case": () => {
    const [sectionXml, setSectionXml] = useState(
      "<Section name='section1'><Task name='task1' /><Task name='task2' /></Section>"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Section
            uiSection={new UISection(sectionXml)}
            onUpdateSectionCallback={(uiSection) => {
              console.log("onUpdateSectionCallback called");
              setSectionXml(uiSection._xml);
            }}
          />
        </FixtureWrapper>
      </Box>
    );
  },
};

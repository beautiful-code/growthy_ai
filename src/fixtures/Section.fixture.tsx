import { useState } from "react";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box } from "@chakra-ui/react";
import { Section } from "common/components/outline/Section";
import { UISection } from "domain/blog-article/UISection";

export default {
  "base case": () => {
    const [sectionXml, setSectionXml] = useState(
      "<Section name='section1'><Task name='task1' /><Task name='task2' /></Section>"
    );

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Section
           // sectionIndex={0}
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
  // editing: () => {
  //   const [expandedSectionIndices, setExpandedSectionIndices] = useState<
  //     number[]
  //   >([]);
  //   const [sections, setSections] = useState([
  //     {
  //       title: "Architecture",
  //       tasks: [
  //         {
  //           text: "Introduce Microservices Architecture",
  //           is_action_item: true,
  //         },
  //         {
  //           text: "Introduce Microservices Architecture",
  //           is_action_item: true,
  //         },
  //       ],
  //     },
  //   ]);

  //   return (
  //     <Box m={8}>
  //       <FixtureWrapper>
  //         <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
  //           <Section
  //             defaultEditing={true}
  //             sectionIndex={0}
  //             section={sections[0]}
  //             checkingDisabled={false}
  //             setSections={setSections}
  //             setExpandedSectionIndices={setExpandedSectionIndices}
  //           />
  //         </Accordion>
  //       </FixtureWrapper>
  //     </Box>
  //   );
  // },
  // disabled: () => {
  //   const [expandedSectionIndices, setExpandedSectionIndices] = useState<
  //     number[]
  //   >([]);
  //   const [sections, setSections] = useState([
  //     {
  //       title: "Architecture",
  //       tasks: [
  //         {
  //           text: "Introduce Microservices Architecture",
  //           is_action_item: true,
  //         },
  //         {
  //           text: "Introduce Microservices Architecture",
  //           is_action_item: true,
  //         },
  //       ],
  //     },
  //   ]);

  //   return (
  //     <Box m={8}>
  //       <FixtureWrapper>
  //         <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
  //           <Section
  //             defaultEditing={false}
  //             sectionIndex={0}
  //             section={sections[0]}
  //             checkingDisabled={true}
  //             setSections={setSections}
  //             setExpandedSectionIndices={setExpandedSectionIndices}
  //           />
  //         </Accordion>
  //       </FixtureWrapper>
  //     </Box>
  //   );
  // },
};

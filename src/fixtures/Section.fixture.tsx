import { useState } from "react";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Box, Accordion } from "@chakra-ui/react";
import { Section } from "common/components/outline/Section";

export default {
  "base case": () => {
    const [expandedSectionIndices, setExpandedSectionIndices] = useState<
      number[]
    >([]);
    const [sections, setSections] = useState([
      {
        title: "Architecture",
        tasks: [
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
        ],
      },
    ]);

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
            <Section
              defaultEditing={false}
              sectionIndex={0}
              section={sections[0]}
              checkingDisabled={false}
              setSections={setSections}
              setExpandedSectionIndices={setExpandedSectionIndices}
            />
          </Accordion>
        </FixtureWrapper>
      </Box>
    );
  },
  editing: () => {
    const [expandedSectionIndices, setExpandedSectionIndices] = useState<
      number[]
    >([]);
    const [sections, setSections] = useState([
      {
        title: "Architecture",
        tasks: [
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
        ],
      },
    ]);

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
            <Section
              defaultEditing={true}
              sectionIndex={0}
              section={sections[0]}
              checkingDisabled={false}
              setSections={setSections}
              setExpandedSectionIndices={setExpandedSectionIndices}
            />
          </Accordion>
        </FixtureWrapper>
      </Box>
    );
  },
  disabled: () => {
    const [expandedSectionIndices, setExpandedSectionIndices] = useState<
      number[]
    >([]);
    const [sections, setSections] = useState([
      {
        title: "Architecture",
        tasks: [
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
          {
            text: "Introduce Microservices Architecture",
            is_action_item: true,
          },
        ],
      },
    ]);

    return (
      <Box m={8}>
        <FixtureWrapper>
          <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
            <Section
              defaultEditing={false}
              sectionIndex={0}
              section={sections[0]}
              checkingDisabled={true}
              setSections={setSections}
              setExpandedSectionIndices={setExpandedSectionIndices}
            />
          </Accordion>
        </FixtureWrapper>
      </Box>
    );
  },
};

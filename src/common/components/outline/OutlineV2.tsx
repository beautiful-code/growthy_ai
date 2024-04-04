import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { SectionV2 } from "types"; // make sure the path is correct

export const OutlineV2 = () => {
  const [sections, setSections] = useState<SectionV2[]>([]);

  useEffect(() => {
    const dummySections: SectionV2[] = [
      {
        title: "Introduction to Microservices Architecture",
        tasks: [],
      },
      {
        title: "Benefits of using Linkerd for Microservices",
        tasks: [],
      },
      {
        title: "Implementing Linkerd in a Microservices Architecture",
        tasks: [
          {
            text: "Setting up Linkerd as a Service Mesh",
            is_action_item: true,
          },
          {
            text: "Configuring and Managing Microservices with Linkerd",
            is_action_item: true,
          },
          {
            text: "Monitoring and Troubleshooting with Linkerd",
            is_action_item: true,
          },
        ],
      },
      {
        title:
          "Best Practices for Monitoring and Maintaining a Microservices Architecture",
        tasks: [
          {
            text: "Using Prometheus and Grafana for Monitoring",
            is_action_item: true,
          },
          {
            text: "Implementing Automated Alerts and Notifications",
            is_action_item: true,
          },
        ],
      },
    ];
    setSections(dummySections);
  }, []);

  return (
    <Accordion allowMultiple allowToggle>
      {sections.map((section, sectionIndex) => (
        <AccordionItem key={sectionIndex} border="none">
          <h2>
            <AccordionButton
              _hover={{ bg: "none" }}
              _focus={{ boxShadow: "none" }}
              _expanded={{ bg: "none", fontWeight: "bold" }}
              p={0}
            >
              <Box as="span" marginRight="4" fontSize="lg" fontWeight="bold">
                &bull;
              </Box>
              <Text as="span" fontSize="lg" fontWeight="semibold">
                {section.title}
              </Text>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} pl={10}>
            {section.tasks.map((task, taskIndex) => (
              <Box key={taskIndex}>
                {task.is_action_item ? (
                  <Checkbox size="md" pt={2}>
                    {task.text}
                  </Checkbox>
                ) : (
                  <Text pt={2}>{task.text}</Text>
                )}
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

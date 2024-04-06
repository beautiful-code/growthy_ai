import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Outline } from "common/components/outline/Outline";

import { SectionV2 } from "types";

const dummySections: SectionV2[] = [
  {
    title: "Introduction to Microservices Architecture",
    tasks: [
      {
        text: "Introduce Microservices Architecture",
        is_action_item: true,
      },
      {
        text: "Discuss the benefits of Microservices",
        is_action_item: true,
      },
    ],
  },
  {
    title: "Benefits of using Linkerd for Microservices",
    tasks: [
      {
        text: "Discuss the benefits of using Linkerd",
        is_action_item: true,
      },
      {
        text: "Explain how Linkerd can help with Microservices",
        is_action_item: true,
      },
    ],
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

export default {
  "base case": (
    <FixtureWrapper>
      <Outline defaultSections={dummySections} />
    </FixtureWrapper>
  ),

  "first section expanded": () => {
    return (
      <FixtureWrapper>
        <Outline
          defaultSections={dummySections}
          defaultExpandedSectionIndices={[0]}
        />
      </FixtureWrapper>
    );
  },
  "all sections expanded": () => {
    return (
      <FixtureWrapper>
        <Outline
          defaultSections={dummySections}
          defaultExpandedSectionIndices={[0, 1, 2, 3]}
        />
      </FixtureWrapper>
    );
  },
  "all sections collapsed": () => {
    return (
      <FixtureWrapper>
        <Outline
          defaultSections={dummySections}
          defaultExpandedSectionIndices={[]}
        />
      </FixtureWrapper>
    );
  },
  "few sections expanded": () => {
    return (
      <FixtureWrapper>
        <Outline
          defaultSections={dummySections}
          defaultExpandedSectionIndices={[0, 2]}
        />
      </FixtureWrapper>
    );
  },
  "checking disabled": () => {
    return (
      <FixtureWrapper>
        <Outline defaultSections={dummySections} />
      </FixtureWrapper>
    );
  },
  "checking enabled": () => {
    return (
      <FixtureWrapper>
        <Outline defaultSections={dummySections} />
      </FixtureWrapper>
    );
  },
};

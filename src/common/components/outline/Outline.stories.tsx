import { useState } from "react";
import { Outline, OutlineProps } from "common/components/outline/Outline";
import { UIOutline } from "domain/common/UIOutline";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<OutlineProps> = {
  title: "common/outline/Outline",
  component: Outline,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<OutlineProps>;

export const OutlineForCreation: Story = {
  args: {},
  render: (args) => {
    const [outlineXML, setOutlineXML] = useState(
      "<Outline><Section name='section1'><Task name='task1' /><Task name='task2' /></Section></Outline>"
    );

    return (
      <FixtureWrapper>
        <Outline
          {...args}
          uiOutline={new UIOutline(outlineXML)}
          onUpdateOutlineCallback={(uiOutline) => {
            console.log("onUpdateOutlineCallback called");
            setOutlineXML(uiOutline._xml);
          }}
        />
      </FixtureWrapper>
    );
  },
};

export const OutlineForExecution: Story = {
  args: {},
  render: (args) => {
    const [outlineXML, setOutlineXML] = useState(
      "<Outline><Section name='section1'><Task name='task1' /><Task name='task2' /></Section></Outline>"
    );

    return (
      <FixtureWrapper>
        <Outline
          {...args}
          uiOutline={new UIOutline(outlineXML)}
          checkingEnabled={true}
          taskSelectionEnabled={true}
          onUpdateOutlineCallback={(uiOutline) => {
            console.log("onUpdateOutlineCallback called");
            setOutlineXML(uiOutline._xml);
          }}
        />
      </FixtureWrapper>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { SlateEditor } from "./SlateEditor";
import { FixtureWrapper } from "FixtureWrapper";

const meta = {
  title: "SlateEditor",
  component: SlateEditor,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <FixtureWrapper>
        <Story />
      </FixtureWrapper>
    ),
  ],
} satisfies Meta<typeof SlateEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

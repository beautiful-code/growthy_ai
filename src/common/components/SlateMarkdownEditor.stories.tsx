import type { Meta, StoryObj } from "@storybook/react";
import { SlateMarkdownEditor } from "./SlateMarkdownEditor";
import { FixtureWrapper } from "FixtureWrapper";

const meta = {
  title: "SlateMarkdownEditor",
  component: SlateMarkdownEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <FixtureWrapper>
        <div style={{ width: "90vw", height: "90vh", overflowY: "hidden" }}>
          <Story />
        </div>
      </FixtureWrapper>
    ),
  ],
} satisfies Meta<typeof SlateMarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

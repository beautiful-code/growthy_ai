import type { Meta, StoryObj } from "@storybook/react";
import { SlateEditor } from "./SlateEditor";
import { Box } from "@chakra-ui/react";
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
        <Box m={8}>
          <Story />
        </Box>
      </FixtureWrapper>
    ),
  ],
} satisfies Meta<typeof SlateEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

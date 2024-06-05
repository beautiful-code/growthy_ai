import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FixtureWrapper } from "FixtureWrapper";
import { PreviewMode } from "execute/preview/PreviewMode";

const meta = {
  title: "Execute/PreviewMode",
  component: PreviewMode,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    exerciseId: { control: "text" },
  },
  args: {
    getExercisePreview: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              title: "Generated Section 1",
              tasks: [
                {
                  title: "Task 1",
                  id: "1",
                  content: `Section 1 Task 1 content Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  
                  `,
                  isChecked: false,
                },
                {
                  title: "Task 2",
                  id: "2",
                  content: `
                  Section 1 Task 2 content Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  `,
                  isChecked: true,
                },
              ],
            },
            {
              title: "Generated Section 2",
              tasks: [
                {
                  title: "Task 1",
                  id: "3",
                  content: `Section 2 Task 1 content Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                  isChecked: false,
                },
              ],
            },
            {
              title: "Generated Section 3",
              tasks: [
                {
                  title: "Task 1",
                  id: "5",
                  content: `Section 3 Task 1 content Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  `,
                  isChecked: false,
                },
              ],
            },
            {
              title: "Completed Section 1",
              tasks: [
                {
                  title: "Task 3",
                  id: "7",
                  content: null,
                  isChecked: true,
                },
                {
                  title: "Task 4",
                  id: "8",
                  content: null,
                  isChecked: false,
                },
              ],
            },
            {
              title: "Completed Section 2",
              tasks: [
                {
                  title: "Task 3",
                  id: "9",
                  content: null,
                  isChecked: true,
                },
                {
                  title: "Task 4",
                  id: "10",
                  content: null,
                  isChecked: false,
                },
              ],
            },
            {
              title: "Completed Section 3",
              tasks: [
                {
                  title: "Task 3",
                  id: "11",
                  content: null,
                  isChecked: true,
                },
                {
                  title: "Task 4",
                  id: "12",
                  content: null,
                  isChecked: false,
                },
              ],
            },
          ]);
        }, 1000);
      });
    },
    generateSectionsContent: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("content 1");
        }, 1000);
      });
    },
    saveBulkTasksContent: fn(),
  },
  decorators: [
    (Story) => (
      <FixtureWrapper>
        <div style={{ width: "90vw", height: "90vh", overflowY: "hidden" }}>
          <Story />
        </div>
      </FixtureWrapper>
    ),
  ],
} satisfies Meta<typeof PreviewMode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreviewModeStory: Story = {
  args: {
    exerciseId: "1",
    blogArticle: {
      title: "Blog Article Title",
      xml: "<xml></xml>",
    },
  },
};

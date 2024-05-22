import { Notes, NotesProps } from "notes/Notes";
import { PostgrestError } from "@supabase/supabase-js";
import { TNote } from "types";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const mockGetNoteByTaskId = async (
  taskId: string
): Promise<{
  note: TNote | null;
  error: PostgrestError | null;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        note: {
          id: "1",
          data: "This is test note",
          task_id: taskId,
        },
        error: null,
      });
    }, 1000);
  });
};

const mockGetNoteByTaskIdWithoutData = async (
  taskId: string
): Promise<{
  note: TNote | null;
  error: PostgrestError | null;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        note: {
          id: "1",
          data: "",
          task_id: taskId,
        },
        error: null,
      });
    }, 1000);
  });
};

const mockSaveNote = async (
  note: TNote
): Promise<{ data: TNote; error: PostgrestError | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: note, error: null });
    }, 1000);
  });
};

const NotesStory: React.FC<NotesProps> = ({ ...props }) => {
  return (
    <FixtureWrapper>
      <Notes {...props} />
    </FixtureWrapper>
  );
};

const meta = {
  title: "Execute/Notes",
  component: NotesStory,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Notes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotesWithDefaultValue: Story = {
  args: {
    taskId: "1",
    getNoteByTaskId: mockGetNoteByTaskId,
    saveNote: mockSaveNote,
  },
};

export const NotesWithoutDefaultValue: Story = {
  args: {
    taskId: "1",
    getNoteByTaskId: mockGetNoteByTaskIdWithoutData,
    saveNote: mockSaveNote,
  },
};

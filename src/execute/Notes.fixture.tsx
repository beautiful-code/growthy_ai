import { Notes } from "notes/Notes";
import { PostgrestError } from "@supabase/supabase-js";
import { TNote } from "types";
import { FixtureWrapper } from "FixtureWrapper";

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

export default {
  "Notes with default value": (
    <FixtureWrapper>
      <Notes
        taskId="1"
        getNoteByTaskId={mockGetNoteByTaskId}
        saveNote={mockSaveNote}
      />
    </FixtureWrapper>
  ),
  "Notes without default value": (
    <FixtureWrapper>
      <Notes
        taskId="1"
        getNoteByTaskId={mockGetNoteByTaskIdWithoutData}
        saveNote={mockSaveNote}
      />
    </FixtureWrapper>
  ),
};

import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { MarkdownEditor } from "common/components/MarkdownEditor";
import { DefaultHelperNote } from "notes/DefaultHelperNote";
import {
  getNoteByTaskId as defaultGetNoteByTaskId,
  saveNote as defaultSaveNote,
} from "notes/queries";

export type NotesProps = {
  taskId: string;
  getNoteByTaskId?: (taskId: string) => Promise<{ note: any; error: any }>;
  saveNote?: (note: any) => Promise<{ data: any; error: any }>;
};

export const Notes: React.FC<NotesProps> = ({
  taskId,
  getNoteByTaskId = defaultGetNoteByTaskId,
  saveNote = defaultSaveNote,
}) => {
  const [showHelpText, setShowHelpText] = useState(true);

  const {
    isLoading,
    data: noteData,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["notes", taskId],
    queryFn: () => getNoteByTaskId(taskId),
    gcTime: 0,
  });
  const notes = noteData?.note?.data || "";
  const defaultId = useRef(uuidv4());

  const { mutate: saveNoteMutation, isPending: isSavingNotes } = useMutation({
    mutationFn: saveNote,
  });

  const handleContentChange = (newNotes: string) => {
    if (taskId) {
      console.log(noteData);
      saveNoteMutation({
        id: noteData?.note?.id || defaultId.current,
        task_id: taskId,
        data: newNotes,
      });
    }
  };

  const handlePasteCode = (code: string) => {
    if (taskId) {
      saveNote({
        id: noteData?.note?.id || defaultId.current,
        task_id: taskId,
        data: notes + `\n \`\`\`go\n${code}\`\`\`\n`,
      }).then(() => {
        refetchNotes();
      });
    }
  };

  const handleHelperText = () => {
    setShowHelpText(!showHelpText);
  };

  const isNotesEmpty = !notes || notes === "";

  return (
    <Box
      m="24px"
      ml="40px"
      mt="32px"
      height={"calc(100vh - 65px - 62px - 32px)"}
      overflowY={"auto"}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
          {taskId ? (
            <>
              <Box mb="16px">
                {isNotesEmpty && showHelpText && (
                  <DefaultHelperNote onClose={handleHelperText} />
                )}
              </Box>

              <MarkdownEditor
                markdown={notes || ""}
                onChange={handleContentChange}
                handlePasteCode={handlePasteCode}
              />
              {isSavingNotes && <Text>Saving...</Text>}
            </>
          ) : (
            <Text>Please select an item to start taking notes</Text>
          )}
        </Box>
      )}
    </Box>
  );
};

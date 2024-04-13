import React, { useState } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { MarkdownEditor } from "common/components/MarkdownEditor";
import { DefaultHelperNote } from "notes/DefaultHelperNote";
import {
  getNoteByTaskId as defaultGetNoteByTaskId,
  saveNote as defaultSaveNote,
} from "notes/queries";

type Props = {
  taskId: string;
  getNoteByTaskId?: (taskId: string) => Promise<{ note: any; error: any }>;
  saveNote?: (note: any) => Promise<{ data: any; error: any }>;
};

export const Notes: React.FC<Props> = ({
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
  });
  const notes = noteData?.note?.data || "";

  const { mutate: saveNoteMutation, isPending: isSavingNotes } = useMutation({
    mutationFn: saveNote,
  });

  const handleContentChange = (newNotes: string) => {
    if (noteData?.note?.id) {
      saveNoteMutation({
        id: noteData?.note?.id,
        task_id: taskId,
        data: newNotes,
      });
    }
  };

  const handlePasteCode = (code: string) => {
    if (noteData?.note?.id) {
      saveNote({
        id: noteData?.note?.id,
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
      height={"calc(100vh - 50px - 48px - 32px)"}
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
                enableAskGrowthy={true}
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

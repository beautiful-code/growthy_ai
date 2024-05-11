import React from "react";
import { Text } from "@chakra-ui/react";
import { TExecutionModes } from "types";
import { UIOutline } from "domain/common/UIOutline";
import { NotesMode } from "./NotesMode";
import { OutlineMode } from "./OutlineMode";

type RenderModeProps = {
  executionMode: TExecutionModes;
  exerciseXML: string;
  growthExerciseId: string;
  handleOutlineUpdate: (uiOutline: UIOutline) => void;
  getGuidance?: () => Promise<AsyncGenerator<string, void, unknown>>;
};

export const RenderMode: React.FC<RenderModeProps> = ({
  executionMode,
  exerciseXML,
  growthExerciseId,
  handleOutlineUpdate,
  getGuidance,
}) => {
  switch (executionMode) {
    case "Notes":
      return (
        <NotesMode
          exerciseXML={exerciseXML}
          handleOutlineUpdate={handleOutlineUpdate}
          growthExerciseId={growthExerciseId}
          getGuidance={getGuidance}
        />
      );
    case "Outline":
      return (
        <OutlineMode
          exerciseXML={exerciseXML}
          growthExerciseId={growthExerciseId}
          handleOutlineUpdate={handleOutlineUpdate}
        />
      );
    case "Publish":
      return (
        <div>
          <Text>Publish Mode</Text>
        </div>
      );
    default:
      return null;
  }
};

import React, { useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdComment,
} from "react-icons/md";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  targetRange: DOMRect | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleFormat: (editor: any, format: string) => void;
  setTargetRange: React.Dispatch<React.SetStateAction<DOMRect | null>>;
  handleComment: () => void;
};

export const ToolbarPopover: React.FC<Props> = ({
  editor,
  targetRange,
  toggleFormat,
  setTargetRange,
  handleComment,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTargetRange(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setTargetRange]);

  return (
    <Popover isOpen={!!targetRange} placement="top">
      <PopoverTrigger>
        <div
          style={{
            position: "absolute",
            top: `${targetRange?.top || 0 + window.scrollY}px`,
            left: `${targetRange?.left || 0 + window.scrollX}px`,
          }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <ButtonGroup>
            <IconButton
              icon={<MdFormatBold />}
              aria-label="Bold"
              onMouseDown={(event) => {
                event.preventDefault();
                toggleFormat(editor, "bold");
              }}
            />
            <IconButton
              icon={<MdFormatItalic />}
              aria-label="Italic"
              onMouseDown={(event) => {
                event.preventDefault();
                toggleFormat(editor, "italic");
              }}
            />
            <IconButton
              icon={<MdFormatUnderlined />}
              aria-label="Underline"
              onMouseDown={(event) => {
                event.preventDefault();
                toggleFormat(editor, "underline");
              }}
            />
            <IconButton
              icon={<MdComment />}
              aria-label="Comment"
              onMouseDown={(event) => {
                event.preventDefault();
                handleComment();
              }}
            />
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

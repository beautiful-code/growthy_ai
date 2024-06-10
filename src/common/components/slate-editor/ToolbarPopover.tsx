import React, { useEffect, useRef } from "react";
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
  const triggerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const updatePosition = () => {
      if (!targetRange || !triggerRef.current) return;

      const scrollableParent = findScrollableParent(triggerRef.current);
      const scrollY = scrollableParent.scrollTop ?? window.scrollY;
      const scrollX = scrollableParent.scrollLeft ?? window.scrollX;

      const top = targetRange.top + scrollY;
      const left = targetRange.left + scrollX + targetRange.width / 2;

      triggerRef.current.style.top = `${top - 40}px`;
      triggerRef.current.style.left = `${left}px`;
    };

    const findScrollableParent = (element: HTMLElement | null) => {
      while (element && element !== document.body) {
        const { overflowY } = window.getComputedStyle(element);
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return element;
        }
        element = element.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    };

    const scrollableParent = findScrollableParent(triggerRef.current);
    scrollableParent?.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    updatePosition(); // Initial position update

    return () => {
      scrollableParent?.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetRange]);

  return (
    <Popover isOpen={!!targetRange} placement="top">
      <PopoverTrigger>
        <div ref={triggerRef} style={{ position: "absolute", visibility: targetRange ? 'visible' : 'hidden' }} />
      </PopoverTrigger>
      <PopoverContent height={"60px"} width={"fit-content"}>
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

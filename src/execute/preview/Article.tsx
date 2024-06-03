import React, { useRef, useEffect, MutableRefObject } from "react";
import { Box, Text } from "@chakra-ui/react";

// import { MarkdownEditor } from "common/components/MarkdownEditor";
import { SlateEditor } from "common/components/slate-editor/SlateEditor";
import { PreviewSection } from "types";

type Props = {
  sections: PreviewSection[] | undefined;
  selectedSectionIndex: number;
  onTopSectionChangeCallback: (id: number) => void;
  hasUserSelectedSectionRef: MutableRefObject<boolean>;
};

export const Article: React.FC<Props> = ({
  selectedSectionIndex,
  sections,
  onTopSectionChangeCallback,
  hasUserSelectedSectionRef,
}) => {
  const sectionsContainerRef = useRef<HTMLDivElement | null>(null);
  const visibleSectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(sections?.length || 0).fill(null)
  );

  useEffect(() => {
    const element = document.getElementById(
      `execute-preview-mode-section-${selectedSectionIndex}`
    );
    if (element && hasUserSelectedSectionRef.current) {
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "start",
      });
      setTimeout(() => {
        // Assumes the next line runs after the invocation of handleScroll
        hasUserSelectedSectionRef.current = false;
      }, 0);
    }
  });

  const handleScroll = () => {
    if (hasUserSelectedSectionRef.current) return;

    const sectionIndexes = visibleSectionRefs.current
      .filter((ref) => ref !== null)
      .map((ref, index) => {
        const { top } = ref!.getBoundingClientRect();
        return { index, top };
      })
      .filter(({ top }) => top >= 0);

    if (sectionIndexes.length > 0) {
      const topSection = sectionIndexes[0];
      onTopSectionChangeCallback(topSection.index);
    }
  };

  useEffect(() => {
    const scrollableElement = sectionsContainerRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const setVisibleSectionRef = (node: HTMLDivElement | null, index: number) => {
    visibleSectionRefs.current[index] = node;
  };

  return (
    <Box
      pl="16px"
      ref={sectionsContainerRef}
      css={{
        // Max height calculation is hacky
        maxHeight: "calc(101vh - 135px)",
        overflowY: "scroll",
      }}
    >
      {sections?.map((section, index) => (
        <Box
          key={index}
          mb={10}
          ref={(node) => setVisibleSectionRef(node, index)}
          id={`execute-preview-mode-section-${index}`}
        >
          <Box mb={4}>
            <Text
              fontSize={"2xl"}
              fontWeight={"bold"}
              color={index === selectedSectionIndex ? "blue" : undefined}
            >
              {section.title}
            </Text>
          </Box>
          {section?.tasks?.map((task, index) => {
            return task?.content ? (
              // <MarkdownEditor key={index} markdown={task.content} />
              <SlateEditor key={index} initialText={task.content} />
            ) : (
              <Box
                height="200px"
                border="2px dashed #e3e3e3"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.500">{`No Content Available for task - ${task.title}`}</Text>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

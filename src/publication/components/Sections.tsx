import { Box, Text } from "@chakra-ui/react";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
import { formatContentAsMarkdown } from "common/utils";
import { useCallback, useEffect, useRef } from "react";
import { PublicationSection } from "types";

type Props = {
  publicationSections: PublicationSection[];
  selectedSectionIndex: number;
  onTopSectionChange?: (id: number) => void;
};

export const Sections: React.FC<Props> = ({
  publicationSections,
  selectedSectionIndex,
  onTopSectionChange,
}) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(publicationSections.length).fill(null)
  );
  const sections = useRef<HTMLDivElement | null>(null);

  const isUserClickScroll = useRef(false);

  // Sync selected section (React) to scrollIntoView (External browser Api)
  useEffect(() => {
    const element = document.getElementById(String(selectedSectionIndex));
    if (element) {
      isUserClickScroll.current = true;
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "start",
      });
      setTimeout(() => (isUserClickScroll.current = false), 100); // Assuming the scroll takes less than 100ms
    }
  }, [selectedSectionIndex]);

  const handleScroll = () => {
    if (isUserClickScroll.current) return;

    const sectionIndexes = sectionRefs.current
      .filter((ref) => ref !== null)
      .map((ref, index) => {
        const { top } = ref!.getBoundingClientRect();
        return { index, top };
      })
      .filter(({ top }) => top >= 0);

    if (sectionIndexes.length > 0) {
      const topSection = sectionIndexes[0];
      if (onTopSectionChange) {
        onTopSectionChange(topSection.index);
      }
    }
  };

  // Sync browser scroll operations (External browser Api) to handleScroll (React)
  useEffect(() => {
    const scrollableElement = sections.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRef = useCallback((node: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = node;
  }, []);

  return (
    <Box
      ref={sections}
      css={{
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
      }}
    >
      {publicationSections.map((publicationSection, index) => (
        <Box
          key={index}
          mb={10}
          ref={(node) => setRef(node, index)}
          id={index.toString()}
        >
          <Box mb={4}>
            <Text
              fontSize={"2xl"}
              fontWeight={"bold"}
              color={index === selectedSectionIndex ? "blue" : undefined}
            >
              {publicationSection.title}
            </Text>
          </Box>
          {publicationSection.content != "" && publicationSection.content ? (
            <Box>
              <MarkdownRenderer>
                {formatContentAsMarkdown(publicationSection.content)}
              </MarkdownRenderer>
            </Box>
          ) : (
            <Box
              height="200px"
              border="2px dashed #e3e3e3"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500">{`No Content Available for Section - ${publicationSection.title}`}</Text>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

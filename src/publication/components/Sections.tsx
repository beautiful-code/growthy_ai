import { Box, Text } from "@chakra-ui/react";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
import { MutableRefObject, useEffect, useRef } from "react";
import { PublicationSection } from "types";

type Props = {
  publicationSections: PublicationSection[];
  selectedSectionIndex: number;
  onTopSectionChangeCallback: (id: number) => void;
  hasUserSelectedSectionRef: MutableRefObject<boolean>;
};

export const Sections: React.FC<Props> = ({
  publicationSections,
  selectedSectionIndex,
  onTopSectionChangeCallback,
  hasUserSelectedSectionRef,
}) => {
  const visibleSectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(publicationSections.length).fill(null)
  );
  const sectionsRef = useRef<HTMLDivElement | null>(null);

  // Sync selected section (React) to scrollIntoView (External browser Api)
  useEffect(() => {
    const element = document.getElementById(String(selectedSectionIndex));
    if (element && hasUserSelectedSectionRef.current) {
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "start",
      });
      setTimeout(() => {
        // Assumes the next line runs after the invocation of handleScroll
        hasUserSelectedSectionRef.current = false
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

  // Sync browser scroll operations (External browser Api) to handleScroll (React)
  useEffect(() => {
    const scrollableElement = sectionsRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const setSectionRef = (node: HTMLDivElement | null, index: number) => {
    visibleSectionRefs.current[index] = node;
  };

  return (
    <Box
      ref={sectionsRef}
      css={{
        // Max height calculation is hacky
        maxHeight: "calc(101vh - 135px)",
        overflowY: "scroll",
      }}
    >
      {publicationSections.map((publicationSection, index) => (
        <Box
          key={index}
          mb={10}
          ref={(node) => setSectionRef(node, index)}
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
                {publicationSection.content}
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

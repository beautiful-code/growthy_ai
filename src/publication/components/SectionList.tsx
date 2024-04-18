import { Box, Link } from "@chakra-ui/react";
import { PublicationSection } from "types";

type Props = {
  publicationSections: PublicationSection[];
  onSelectionCallback: (id: number) => void;
  selectedSectionIndex: number;
};

export const SectionList: React.FC<Props> = ({
  publicationSections,
  onSelectionCallback,
  selectedSectionIndex,
}) => {
  const sectionTitles = publicationSections.map((section) => section.title);

  return (
    <>
      {sectionTitles.map((sectionTitle, index) => (
        <Box
          key={index}
          p={2}
          borderRadius={"4px"}
          cursor="pointer"
          fontSize={"large"}
          onClick={() => {
            onSelectionCallback(index);
          }}
        >
          <Link
            color={index === selectedSectionIndex ? "blue" : undefined}
            textDecoration={
              index === selectedSectionIndex ? "underline" : "none"
            }
          >
            {sectionTitle}
          </Link>
        </Box>
      ))}
    </>
  );
};

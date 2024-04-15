import { Box, Text } from "@chakra-ui/react";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
import { formatContentAsMarkdown } from "common/utils";
import { useEffect } from "react";
import { PublicationSection } from "types"

type Props = {
    publicationSections: PublicationSection[]
    selectedSectionIndex: number
}

export const Sections: React.FC<Props> = ({publicationSections, selectedSectionIndex}) => {
      // sync selectedSectionIndex to scroll to the section with that index
      useEffect(() => {
        const element = document.getElementById(String(selectedSectionIndex));
        element!.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
      }, [selectedSectionIndex])
        
    return (

        <Box>
            {publicationSections.map((publicationSection, index) => (
              <Box key={index}  mb={4}>
                <Box id={index.toString()} mb={4} mt={index === 0 ? 0 : 10}>
                <Text fontSize={"2xl"} fontWeight={"normal"} color={index === selectedSectionIndex ? "blue" : undefined} >{publicationSection.sectionTitle}</Text>
                </Box>
                {  
                (publicationSection.sectionContent != "") ? (
                  (
                    <Box>    
                            <MarkdownRenderer >
                                {formatContentAsMarkdown(publicationSection.sectionContent)}
                            </MarkdownRenderer>
                    </Box>
                  )
                ) : (
                  <Box>
                      <Box
                        height="200px"
                        border="2px dashed #e3e3e3"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">{`No Content Available for Section - ${publicationSection.sectionTitle}`}</Text>
                      </Box>
                  </Box>
                )}
              </Box>
            ))}
        </Box>

    );
}
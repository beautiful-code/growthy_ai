import { Box, Text } from "@chakra-ui/react";
import { MarkdownRenderer } from "common/components/MarkdownRenderer";
import { formatContentAsMarkdown } from "common/utils";
import { PublicationSection } from "types"

type Props = {
    publicationSection: PublicationSection
    sectionIndex: string
}

export const RenderSection: React.FC<Props> = ({publicationSection, sectionIndex}) => {
        
    return (
      <Box key={sectionIndex} id={sectionIndex}  mb={4}>
        <Box mb={4} mt={sectionIndex == "0" ? 0 : 10}>
            <MarkdownRenderer>
                {`${"# "}${publicationSection.sectionTitle}`}
            </MarkdownRenderer>
        </Box>
        {(publicationSection.content.length > 0 &&  
        (publicationSection.content.length==1 && publicationSection.content[0])) ? (
          (
            <Box>    
                {publicationSection.content.map((content, contentIndex) =>(
                    <MarkdownRenderer key={`content-${contentIndex}`}>
                        {formatContentAsMarkdown(content)}
                    </MarkdownRenderer>
                ))}
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
    );
}
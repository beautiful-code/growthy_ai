import React, { useState } from "react";
import { Accordion, Box, Flex, Button } from "@chakra-ui/react";

import { BlogArticle } from "domain/blog-article/BlogArticleV2";
import { Section } from "common/components/outline/SectionDeprecated";

type Props = {
  checkingDisabled?: boolean;
  blogArticleXML: string;
  setBlogArticleXml: (xml: string) => void;
};

export const Outline: React.FC<Props> = ({
  checkingDisabled = false, // Remove it YAGNI
  blogArticleXML,
  setBlogArticleXml,
}) => {
  const blogArticle = new BlogArticle(blogArticleXML);

  const sections = blogArticle.getSections();

  const [expandedSectionIndices, setExpandedSectionIndices] = useState<
    number[]
  >([]);

  const handleExpandAll = () => {
    setExpandedSectionIndices(sections?.map((_, index) => index));
  };

  const handleCollapseAll = () => {
    setExpandedSectionIndices([]);
  };

  return (
    <Box>
      <Accordion allowMultiple allowToggle index={expandedSectionIndices}>
        {sections.map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            sectionIndex={sectionIndex}
            section={section}
            blogArticle={blogArticle}
            checkingDisabled={checkingDisabled}
            setBlogArticleXml={setBlogArticleXml}
            setExpandedSectionIndices={setExpandedSectionIndices}
          />
        ))}
      </Accordion>

      <Flex justify={"flex-end"}>
        <Button
          size="xs"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleExpandAll}
        >
          Expand all
        </Button>
        <Button
          size="xs"
          ml="8px"
          border="1px solid #E2E8F0"
          backgroundColor={"white"}
          color={"primary.500"}
          onClick={handleCollapseAll}
        >
          Collapse all
        </Button>
      </Flex>
    </Box>
  );
};

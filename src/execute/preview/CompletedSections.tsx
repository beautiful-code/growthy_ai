import React, { useEffect, useState } from "react";
import { Box, Flex, Checkbox, Text, Spinner } from "@chakra-ui/react";
import { PostgrestError } from "@supabase/supabase-js";

import { GButton } from "common/components/GButton";
import { PreviewSection, Dictionary, TGeneratedTasksContent } from "types";
import { useGenerateSectionsContent } from "execute/hooks/useGenerateSectionContent";
import { useSaveContent } from "execute/hooks/useSaveContent";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";
import { saveBulkTasksContent as defaultSaveBulkTasksContent } from "execute/queries";

type Props = {
  sections: PreviewSection[];
  generateSectionsContent?: ({
    blog_article_goal,
    blog_article_xml,
    sections,
  }: {
    blog_article_goal: string;
    blog_article_xml: string;
    sections: PreviewSection[];
  }) => Promise<string[]>;
  saveBulkTasksContent?: (
    tasksContent: TGeneratedTasksContent[]
  ) => Promise<{ data: null; error: PostgrestError | null }>;
  refetchSections: () => void;
};

export const CompletedSections: React.FC<Props> = ({
  sections,
  generateSectionsContent = defaultGenerateSectionsContent,
  saveBulkTasksContent = defaultSaveBulkTasksContent,
  refetchSections,
}) => {
  const [selectedSectionsMap, setSelectedSectionsMap] = useState<Dictionary>(
    {}
  );

  const {
    sections: generatedSections,
    isFetching,
    refetch,
  } = useGenerateSectionsContent({
    enabled: false,
    blog_article_goal: "",
    blog_article_xml: "",
    sections: sections?.filter((_section, index) => {
      return selectedSectionsMap[index];
    }),
    generateSectionsContent,
  });

  const { saveBulkTasksContentMutation, isPending } = useSaveContent({
    saveBulkTasksContent,
    onSuccess: () => {
      refetchSections();
    },
  });

  useEffect(() => {
    if (!isFetching) {
      const generatedTaskContent: TGeneratedTasksContent[] = [];

      generatedSections.forEach((section) => {
        const tasks = section.tasks;
        tasks.forEach((task) => {
          generatedTaskContent.push({
            taskId: task.id,
            content: task.content || "",
          });
        });
      });

      saveBulkTasksContentMutation({
        tasksContent: generatedTaskContent,
      });
    }
  }, [isFetching]);

  const handleCheck = (index: number) => {
    setSelectedSectionsMap((prev) => {
      return {
        ...prev,
        [index]: !prev[index],
      };
    });
  };

  const handleGenerate = () => {
    refetch();
  };

  return (
    <Box>
      {sections?.map((section, index) => (
        <Flex key={index}>
          <Checkbox
            isChecked={selectedSectionsMap[index]}
            onChange={() => handleCheck(index)}
          />

          <Text ml="8px">{section.title}</Text>
        </Flex>
      ))}

      <GButton mt="8px" size={"sm"} onClick={handleGenerate}>
        Generate
        {(isFetching || isPending) && <Spinner size="sm" ml="4px" />}
      </GButton>
    </Box>
  );
};

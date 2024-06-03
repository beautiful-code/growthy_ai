import React, { useEffect, useState } from "react";
import { Box, Flex, Checkbox, Text, Spinner } from "@chakra-ui/react";
import { PostgrestError } from "@supabase/supabase-js";

import { GButton } from "common/components/GButton";
import { UISection } from "domain/common/UISection";
import { UITask } from "domain/common/UITask";
import { Dictionary, TGeneratedTasksContent } from "types";
import { useGenerateSectionsContent } from "execute/hooks/useGenerateSectionContent";
import { useGetBulkTaskNotes } from "execute/hooks/useGetBulkTaskNotes";
import { useSaveContent } from "execute/hooks/useSaveContent";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";
import { saveBulkTasksContent as defaultSaveBulkTasksContent } from "execute/queries";
import { getTasksTitles } from "execute/preview/utils";

type Props = {
  sections: UISection[];
  blogArticle: {
    blog_article_title: string;
    blog_article_xml: string;
  };
  generateSectionsContent?: ({
    blog_article_task,
    blog_article_xml,
    blog_article_title,
    blog_article_task_notes,
  }: {
    blog_article_task: string;
    blog_article_xml: string;
    blog_article_title: string;
    blog_article_task_notes: string;
  }) => Promise<string>;
  saveBulkTasksContent?: (
    tasksContent: TGeneratedTasksContent[]
  ) => Promise<{ data: null; error: PostgrestError | null }>;
  refetchSections: () => void;
};

export const CompletedSections: React.FC<Props> = ({
  sections,
  blogArticle,
  generateSectionsContent = defaultGenerateSectionsContent,
  saveBulkTasksContent = defaultSaveBulkTasksContent,
  refetchSections,
}) => {
  const [selectedSectionsMap, setSelectedSectionsMap] = useState<Dictionary>(
    {}
  );

  const { data: taskNotes, isLoading } = useGetBulkTaskNotes(
    sections
      .map((section) => section.getUITasks().map((task) => task.id))
      .flat()
  );

  const { content, isFetching, refetch } = useGenerateSectionsContent({
    enabled: false,
    blog_article_tasks: getTasksTitles(sections),
    blog_article_xml: blogArticle.blog_article_xml,
    blog_article_title: blogArticle.blog_article_title,
    blog_article_tasks_notes: taskNotes?.map((note) => note.content) || [],
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

      sections?.forEach((section, index) => {
        if (selectedSectionsMap[index]) {
          section.tasks.forEach((task: UITask) => {
            generatedTaskContent.push({
              taskId: task.id,
              content: content[index],
            });
          });
        }
      });

      saveBulkTasksContentMutation({
        tasksContent: generatedTaskContent,
      });
    }
  }, [
    content,
    isFetching,
    saveBulkTasksContentMutation,
    sections,
    selectedSectionsMap,
  ]);

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

      <GButton
        disabled={isFetching || isPending || isLoading}
        mt="8px"
        size={"sm"}
        onClick={handleGenerate}
      >
        Generate
        {(isFetching || isPending) && <Spinner size="sm" ml="4px" />}
      </GButton>
    </Box>
  );
};

import React, {
  useRef,
  useState,
  // useRef
} from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { PostgrestError } from "@supabase/supabase-js";

import { SectionList } from "publication/components/SectionList";
import { CompletedSections } from "execute/preview/CompletedSections";
import { Article } from "execute/preview/Article";
import {
  PublicationSection,
  PreviewSection,
  TGeneratedTasksContent,
} from "types";
import { useGetExercisePreview } from "execute/hooks/useGetExercisePreview";
import {
  getExercisePreview as defaultGetExercisePreview,
  saveBulkTasksContent as defaultSaveBulkTasksContent,
  updateTaskContent as defaultUpdateTaskContent,
} from "execute/queries";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";

type Props = {
  exerciseId: string;
  blogArticle: {
    title: string;
    xml: string;
  };
  getExercisePreview?: (
    exerciseId: string
  ) => Promise<PreviewSection[] | undefined>;
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
  updateTaskContent?: (
    taskContent: TGeneratedTasksContent
  ) => Promise<{ data: null; error: PostgrestError | null }>;
};

export const PreviewMode: React.FC<Props> = ({
  exerciseId,
  blogArticle,
  getExercisePreview = defaultGetExercisePreview,
  generateSectionsContent = defaultGenerateSectionsContent,
  saveBulkTasksContent = defaultSaveBulkTasksContent,
  updateTaskContent = defaultUpdateTaskContent,
}) => {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const hasUserSelectedSectionRef = useRef<boolean>(false);

  const {
    completedSections,
    generatedSections,
    refetch: refetchSections,
  } = useGetExercisePreview({
    exerciseId: exerciseId!,
    getExercisePreview,
  });

  const generatedSectionsCasted =
    (generatedSections?.map((section) => ({
      title: section.title,
      content: "",
    })) as PublicationSection[]) || [];

  const handleSelectSection = (index: number) => {
    setSelectedSectionIndex(index);
    hasUserSelectedSectionRef.current = true;
  };

  const onTopSectionChangeCallback = (sectionIndex: number) => {
    setSelectedSectionIndex(sectionIndex);
  };

  return (
    <Grid templateColumns={"20% 80%"} height={"calc(100vh - 64px)"}>
      <GridItem borderRight={"1px solid #e3e3e3"} paddingLeft={"20px"}>
        <SectionList
          publicationSections={generatedSectionsCasted}
          selectedSectionIndex={selectedSectionIndex}
          onSelectionCallback={handleSelectSection}
        />
        <Box mt={"64px"}>
          <CompletedSections
            sections={completedSections || []}
            blogArticle={{
              blog_article_xml: blogArticle.xml,
              blog_article_title: blogArticle.title,
            }}
            generateSectionsContent={generateSectionsContent}
            saveBulkTasksContent={saveBulkTasksContent}
            refetchSections={refetchSections}
          />
        </Box>
      </GridItem>
      <GridItem>
        <Article
          selectedSectionIndex={selectedSectionIndex}
          sections={generatedSections}
          onTopSectionChangeCallback={onTopSectionChangeCallback}
          hasUserSelectedSectionRef={hasUserSelectedSectionRef}
          updateTaskContent={updateTaskContent}
          refetchSections={refetchSections}
        />
      </GridItem>
    </Grid>
  );
};

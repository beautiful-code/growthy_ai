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
} from "execute/queries";
import { generateSectionsContent as defaultGenerateSectionsContent } from "execute/chains/generateSectionContent";

type Props = {
  exerciseId: string;
  getExercisePreview?: (
    exerciseId: string
  ) => Promise<PreviewSection[] | undefined>;
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
};

export const PreviewMode: React.FC<Props> = ({
  exerciseId,
  getExercisePreview = defaultGetExercisePreview,
  generateSectionsContent = defaultGenerateSectionsContent,
  saveBulkTasksContent = defaultSaveBulkTasksContent,
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
    <Grid templateColumns={"20% 80%"}>
      <GridItem borderRight={"1px solid #e3e3e3"}>
        <SectionList
          publicationSections={generatedSectionsCasted}
          selectedSectionIndex={selectedSectionIndex}
          onSelectionCallback={handleSelectSection}
        />
        <Box mt={"64px"}>
          <CompletedSections
            sections={completedSections || []}
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
        />
      </GridItem>
    </Grid>
  );
};

import React, { useState, useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Flex, Text, Box, Grid, GridItem } from "@chakra-ui/react";
import {
  useParams as useDefaultUseParams,
  useNavigate,
} from "react-router-dom";
import { FaHome } from "react-icons/fa";

import { TExecutionModes, TGrowthExercise } from "types";
import { Header } from "common/components/header/Header";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UIOutline } from "domain/common/UIOutline";
import { useGetExercise } from "./hooks/useGetExercise";
import { getExercise as defaultGetExercise } from "execute/queries";
import { saveGrowthExercise as defaultSaveGrowthExercise } from "growth-exercise/queries";

import "./ExecuteView.css";
import { SkeletonScreen } from "common/components/SkeletonScreen";
import { ToggleMode } from "common/components/ToggleMode";
import { RenderMode } from "./RenderMode";

type Props = {
  useParams?: () => { growthExerciseId: string };
  getExercise?: (
    id: string
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  saveGrowthExercise?: (
    data: TGrowthExercise
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  getGuidance?: () => Promise<AsyncGenerator<string, void, unknown>>;
};

export const ExecuteView: React.FC<Props> = ({
  useParams = useDefaultUseParams,
  getExercise = defaultGetExercise,
  saveGrowthExercise = defaultSaveGrowthExercise,
  getGuidance,
}) => {
  const { growthExerciseId = "" } = useParams<{ growthExerciseId: string }>();
  const navigate = useNavigate();

  const [exerciseXML, setExerciseXML] = useState("");

  const { mutate: saveGrowthExerciseMutation } = useMutation({
    mutationFn: saveGrowthExercise,
  });

  const [executionMode, setExecutionMode] = useState<TExecutionModes>("Notes");
  const { exercise, isLoading } = useGetExercise(growthExerciseId, getExercise);

  useEffect(() => {
    if (exercise?.xml_text) {
      setExerciseXML(exercise.xml_text);
    }
  }, [exercise?.xml_text]);

  const handleNavigateToHome = () => {
    navigate("/");
  };

  if (isLoading || !exerciseXML) {
    return <SkeletonScreen />;
  }

  const blogArticle = new UIBlogArticle(exerciseXML || "");
  const handleOutlineUpdate = (uiOutline: UIOutline) => {
    blogArticle.updateOutline(uiOutline);
    setExerciseXML(blogArticle._xml);

    // Persist in DB
    saveGrowthExerciseMutation({
      ...exercise,
      inputs: exercise?.inputs || {},
      state: exercise?.state || "created",
      type: "blog-article",
      xml_text: blogArticle.getUIStatelessXML(),
    });
  };

  return (
    <div>
      <Box p="4px" borderBottom={"1px solid #e3e3e3"}>
        <Header showAvatar={false}>
          <Grid templateColumns="1fr auto" alignItems="center" w="100%">
            <GridItem>
              <Flex ml="24px" align="center">
                <FaHome cursor="pointer" onClick={handleNavigateToHome} />
                <Text ml="8px">{blogArticle?.getTitle()}</Text>
              </Flex>
            </GridItem>

            <GridItem>
              <Flex justifyContent="flex-end" mr="24px">
                <ToggleMode mode={executionMode} setMode={setExecutionMode} />
              </Flex>
            </GridItem>
          </Grid>
        </Header>
      </Box>
      <RenderMode
        executionMode={executionMode}
        exerciseXML={exerciseXML}
        growthExerciseId={growthExerciseId}
        handleOutlineUpdate={handleOutlineUpdate}
        getGuidance={getGuidance}
      />
    </div>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Flex, Text, Box, Button } from "@chakra-ui/react";
import { useParams as useDefaultUseParams } from "react-router-dom";
import { FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { TGrowthExercise } from "types";
import { Header } from "common/components/header/Header";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UIOutline } from "domain/common/UIOutline";
import { Outline } from "common/components/outline/Outline";
import { Notes } from "notes/Notes";
import { useGetExercise } from "./hooks/useGetExercise";
import { getExercise as defaultGetExercise } from "execute/queries";
import { saveGrowthExercise as defaultSaveGrowthExercise } from "growth-exercise/queries";

import "./ExecuteView.css";
import { SkeletonScreen } from "common/components/SkeletonScreen";

type Props = {
  useParams: () => { growthExerciseId: string };
  getExercise: (
    id: string
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  saveGrowthExercise: (
    data: TGrowthExercise
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
};

export const ExecuteView: React.FC<Props> = ({
  useParams = useDefaultUseParams,
  getExercise = defaultGetExercise,
  saveGrowthExercise = defaultSaveGrowthExercise,
}) => {
  const { growthExerciseId } = useParams<{ growthExerciseId: string }>();

  const containerRef = useRef<HTMLDivElement>(null);

  const [exerciseXML, setExerciseXML] = useState("");

  const { exercise, isLoading } = useGetExercise(
    growthExerciseId || "",
    getExercise
  );

  useEffect(() => {
    if (exercise?.xml_text) {
      setExerciseXML(exercise.xml_text);
    }
  }, [exercise?.xml_text]);

  const { mutate: saveGrowthExerciseMutation } = useMutation({
    mutationFn: saveGrowthExercise,
  });

  const [columnWidths, setColumnWidths] = useState([20, 70, 0]);
  const [isFirstColumnExpanded, setIsFirstColumnExpanded] = useState(true);

  const toggleFirstColumn = () => {
    if (isFirstColumnExpanded) {
      setColumnWidths([0, 100, columnWidths[2]]);
    } else {
      setColumnWidths([20, 80, columnWidths[2]]);
    }

    setIsFirstColumnExpanded(!isFirstColumnExpanded);
  };

  const handleDrag = (index: number, clientX: number) => {
    if (!containerRef.current) return;

    const startWidths = [...columnWidths];
    const containerRect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - clientX;
      const totalWidth = containerRect.right - containerRect.left;
      const dxPercentage = (dx / totalWidth) * 100;

      const helperType = "";
      if (index === 0) {
        const newWidthLeft = Math.max(10, startWidths[0] + dxPercentage);
        const newWidthMiddle = Math.max(10, startWidths[1] - dxPercentage);
        if (helperType || index === 0) {
          // Adjusting for when helperType is not set
          setColumnWidths([newWidthLeft, newWidthMiddle, startWidths[2]]);
        }
      } else if (index === 1 && helperType) {
        // Adjust only if helper is present
        const newWidthMiddle = Math.max(10, startWidths[1] + dxPercentage);
        const newWidthRight = Math.max(10, startWidths[2] - dxPercentage);
        setColumnWidths([startWidths[0], newWidthMiddle, newWidthRight]);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleOutlineUpdate = (uiOutline: UIOutline) => {
    blogArticle.updateOutline(uiOutline);
    setExerciseXML(blogArticle._xml);

    // Persist in DB
    saveGrowthExerciseMutation({
      ...exercise,
      inputs: exercise?.inputs || {},
      state: exercise?.state || "created",
      type: "blog-article",
      xml_text: uiOutline.getUIStatelessXML(),
    });
  };

  if (isLoading || !exerciseXML) {
    return (
      <SkeletonScreen />
    );
  }

  const blogArticle = new UIBlogArticle(exerciseXML || "");

  return (
    <div>
      <Box p="4px" borderBottom={"1px solid #e3e3e3"}>
        <Header>
          <Flex ml={"24px"} align={"center"}>
            <FaHome />
            <Text ml="8px">{blogArticle?.getTitle()}</Text>
          </Flex>
        </Header>
      </Box>
      <div
        ref={containerRef}
        className="resizable-container"
        style={{ display: "flex", width: "100%" }}
      >
        <Box
          className="panel"
          style={{
            width: `${columnWidths[0]}%`,
            height: `calc(100vh - 50px)`,
            overflowY: "auto",
          }}
        >
          <Button
            onClick={toggleFirstColumn}
            size="sm"
            style={{
              position: "absolute",
              left: false
                ? `calc(${columnWidths[0]}%)` // Adjust based on the presence of the right-most panel and to align with the right side of the divider
                : columnWidths[0] > 0
                ? `calc(${columnWidths[0]}% - 18px)` // Slightly different adjustment when the right-most panel is not expanded
                : "4px", // Default to a small offset from the left if the first column is collapsed to zero
              top: "48px",
              zIndex: 10, // Ensure the button is above the resizer div
            }}
          >
            {isFirstColumnExpanded ? <FaArrowLeft /> : <FaArrowRight />}
          </Button>

          <Outline
            uiOutline={blogArticle.getOutline()}
            checkingEnabled={true}
            taskSelectionEnabled={true}
            onUpdateOutlineCallback={handleOutlineUpdate}
          />
        </Box>
        <div
          className="resizer"
          onMouseDown={(e) => handleDrag(0, e.clientX)}
        />
        <Box className="panel" style={{ width: `${columnWidths[1]}%` }}>
          <Text ml="40px" mt="8px" fontSize="larger">
            {blogArticle?.getOutline()?.getSelectedTaskName()}
          </Text>
          <Notes taskId={blogArticle?.getOutline()?.getSelectedTaskId()} />
        </Box>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Flex, Text, Box, Button } from "@chakra-ui/react";
import {
  useParams as useDefaultUseParams,
  useNavigate,
} from "react-router-dom";
import { FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { TGrowthExercise } from "types";
import { Header } from "common/components/header/Header";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { UIOutline } from "domain/common/UIOutline";
import { Outline } from "common/components/outline/Outline";
import { Notes } from "notes/Notes";
import { Actions } from "execute/Actions";
import { useGetExercise } from "./hooks/useGetExercise";
import { getExercise as defaultGetExercise } from "execute/queries";
import { saveGrowthExercise as defaultSaveGrowthExercise } from "growth-exercise/queries";
import { getGuidance as defaultGetGuidance } from "execute/chains/getGuidance";
import { AIGenerateContent } from "execute/growthy-ai-panel/AIGenerateContent";
import { GrowthyConversation } from "common/components/GrowthyConversation";

import "./ExecuteView.css";
import { SkeletonScreen } from "common/components/SkeletonScreen";

type Props = {
  useParams?: () => { growthExerciseId: string };
  getExercise?: (
    id: string
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  saveGrowthExercise?: (
    data: TGrowthExercise
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  getGuidance?: (
    inputs: {
      blog_article_goal: string;
      blog_article_xml: string;
      blog_article_task: string;
    },
    context: string,
    isInitialPrompt: boolean,
    conversation: { type: string; text: string }[]
  ) => void;
};

export const ExecuteView: React.FC<Props> = ({
  useParams = useDefaultUseParams,
  getExercise = defaultGetExercise,
  getGuidance = defaultGetGuidance,
  saveGrowthExercise = defaultSaveGrowthExercise,
}) => {
  const { growthExerciseId } = useParams<{ growthExerciseId: string }>();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const [exerciseXML, setExerciseXML] = useState("");
  const [growthyAIDrawerType, setGrowthyAIDrawerType] = useState<
    "growthy-conversation" | "generate-content" | ""
  >("");

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
      setColumnWidths([
        0,
        100 - (growthyAIDrawerType ? columnWidths[2] : 0),
        columnWidths[2],
      ]);
    } else {
      setColumnWidths([
        20,
        80 - (growthyAIDrawerType ? columnWidths[2] : 0),
        columnWidths[2],
      ]);
    }

    setIsFirstColumnExpanded(!isFirstColumnExpanded);
  };

  const handleGrowthyAIDrawerType = (
    type: "growthy-conversation" | "generate-content" | ""
  ) => {
    const firstColumnWidth = columnWidths[0];
    const availableWidth = 100 - firstColumnWidth;
    setColumnWidths(
      type
        ? [firstColumnWidth, availableWidth / 2, availableWidth / 2]
        : [firstColumnWidth, availableWidth, 0]
    );

    setGrowthyAIDrawerType(type);
  };

  const handleDrag = (index: number, clientX: number) => {
    if (!containerRef.current) return;

    const startWidths = [...columnWidths];
    const containerRect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - clientX;
      const totalWidth = containerRect.right - containerRect.left;
      const dxPercentage = (dx / totalWidth) * 100;

      if (index === 0) {
        const newWidthLeft = Math.max(10, startWidths[0] + dxPercentage);
        const newWidthMiddle = Math.max(10, startWidths[1] - dxPercentage);
        if (growthyAIDrawerType || index === 0) {
          // Adjusting for when helperType is not set
          setColumnWidths([newWidthLeft, newWidthMiddle, startWidths[2]]);
        }
      } else if (index === 1 && growthyAIDrawerType) {
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

  const handleNavigateToHome = () => {
    navigate("/");
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
      xml_text: blogArticle.getUIStatelessXML(),
    });
  };

  if (isLoading || !exerciseXML) {
    return <SkeletonScreen />;
  }

  const blogArticle = new UIBlogArticle(exerciseXML || "");
  console.log(blogArticle._xml);

  return (
    <div>
      <Box p="4px" borderBottom={"1px solid #e3e3e3"}>
        <Header>
          <Flex ml={"24px"} align={"center"}>
            <FaHome cursor={"pointer"} onClick={handleNavigateToHome} />
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
            height: `calc(100vh - 65px)`,
            overflowY: "auto",
          }}
        >
          <Button
            onClick={toggleFirstColumn}
            size="sm"
            style={{
              position: "absolute",
              left: growthyAIDrawerType
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
          <Notes
            taskId={blogArticle?.getOutline()?.getSelectedTaskId() || ""}
          />
        </Box>

        {growthyAIDrawerType === "" ? (
          <Actions handleGrowthyAIDrawerType={handleGrowthyAIDrawerType} />
        ) : (
          <>
            <div
              className="resizer"
              onMouseDown={(e) => handleDrag(1, e.clientX)}
            />
            <Box
              className="panel"
              style={{
                width: `${columnWidths[2]}%`,
                height: "calc(100vh - 65px)",
              }}
            >
              {growthyAIDrawerType === "generate-content" && (
                <AIGenerateContent
                  blogArticleInputs={{
                    blog_article_goal: blogArticle?.getTitle() || "",
                    blog_article_xml: blogArticle?._xml,
                  }}
                  onClose={() => handleGrowthyAIDrawerType("")}
                />
              )}
              {growthyAIDrawerType === "growthy-conversation" &&
                growthExerciseId && (
                  <GrowthyConversation
                    height="100%"
                    resourceId={growthExerciseId}
                    inputs={{
                      blog_article_goal: blogArticle?.getTitle() || "",
                      blog_article_xml: exerciseXML,
                      blog_article_task:
                        blogArticle?.getOutline()?.getSelectedTaskName() || "",
                    }}
                    getConversation={getGuidance}
                    onCloseCallback={() => handleGrowthyAIDrawerType("")}
                  />
                )}
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

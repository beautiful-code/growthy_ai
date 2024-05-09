import { Button, Box, Text } from "@chakra-ui/react";
import { GrowthyConversation } from "common/components/GrowthyConversation";
import { Outline } from "common/components/outline/Outline";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { Notes } from "notes/Notes";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Actions } from "./Actions";
import { AIGenerateContent } from "./growthy-ai-panel/AIGenerateContent";
import { UIOutline } from "domain/common/UIOutline";
import { useRef, useState } from "react";
import { getGuidance as defaultGetGuidance } from "execute/chains/getGuidance";

type Props = {
  exerciseXML: string;
  growthExerciseId: string | undefined;
  handleOutlineUpdate: (uiOutline: UIOutline) => void;
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

export const ExecuteNotesMode: React.FC<Props> = ({
  exerciseXML,
  getGuidance = defaultGetGuidance,
  handleOutlineUpdate,
  growthExerciseId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [growthyAIDrawerType, setGrowthyAIDrawerType] = useState<
    "growthy-conversation" | "generate-content" | ""
  >("");

  const [columnWidths, setColumnWidths] = useState([20, 70, 0]);
  const [isFirstColumnExpanded, setIsFirstColumnExpanded] = useState(true);

  const blogArticle = new UIBlogArticle(exerciseXML || "");

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

  return (
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
          onUpdateOutlineCallback={handleOutlineUpdate}
          checkingEnabled
          taskSelectionEnabled
          allowOutlineChanges
        />
      </Box>
      <div className="resizer" onMouseDown={(e) => handleDrag(0, e.clientX)} />
      <Box className="panel" style={{ width: `${columnWidths[1]}%` }}>
        <Text ml="40px" mt="8px" fontSize="larger">
          {blogArticle?.getOutline()?.getSelectedTaskName()}
        </Text>
        <Notes taskId={blogArticle?.getOutline()?.getSelectedTaskId() || ""} />
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
  );
};

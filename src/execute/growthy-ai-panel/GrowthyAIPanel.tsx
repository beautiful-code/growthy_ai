import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import { AIGenerateContent } from "execute/growthy-ai-panel/AIGenerateContent";
import { GrowthyConversation } from "common/components/GrowthyConversation";
// @ts-expect-error: Svg import
import GrowthyOval from "assets/GrowthyOval.svg?react";
// @ts-expect-error: Svg import
import Hamburger from "assets/Hamburger.svg?react";

type Props = {
  width: number;
  blogArticleInputs: {
    blog_article_goal: string;
    blog_article_xml: string;
  };
  growthyAIDrawerType: "growthy-conversation" | "generate-content" | "";
  handleGrowthyAIDrawerType: (
    type: "growthy-conversation" | "generate-content" | ""
  ) => void;
  handleDrag: (column: number, clientX: number) => void;
};

export const GrowthyAIPanel: React.FC<Props> = ({
  width,
  blogArticleInputs,
  growthyAIDrawerType,
  handleDrag,
  handleGrowthyAIDrawerType,
}) => {
  const onClose = () => {
    handleGrowthyAIDrawerType("");
  };

  return (
    <>
      {growthyAIDrawerType ? (
        <>
          <div
            className="resizer"
            onMouseDown={(e) => handleDrag(1, e.clientX)}
          />
          <Box className="panel" style={{ width: `${width}%` }}>
            {growthyAIDrawerType === "generate-content" && (
              <AIGenerateContent
                blogArticleInputs={blogArticleInputs}
                onClose={onClose}
              />
            )}
            {growthyAIDrawerType === "growthy-conversation" && (
              <GrowthyConversation
                height="calc(100vh - 65px)"
                inputs={{
                  blog_article_goal: "",
                  blog_article_xml: "",
                  blog_article_task: "",
                }}
                resourceId=""
                onCloseCallback={onClose}
                getConversation={() => {}}
              />
            )}
          </Box>
        </>
      ) : (
        <Flex mt={"16px"} justify={"flex-end"} mr={"32px"}>
          <Hamburger
            cursor="pointer"
            onClick={() => handleGrowthyAIDrawerType("generate-content")}
          />
          <Box ml={"16px"}>
            <GrowthyOval
              cursor="pointer"
              onClick={() => handleGrowthyAIDrawerType("growthy-conversation")}
            />
          </Box>
        </Flex>
      )}
    </>
  );
};

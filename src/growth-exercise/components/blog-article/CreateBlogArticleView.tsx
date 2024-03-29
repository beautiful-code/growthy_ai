import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ResizeTextarea from "react-textarea-autosize";
import {
  Text,
  Input,
  Textarea,
  Button,
  Box,
  Flex,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

import { TNode } from "types";
import { UserAvatar } from "common/components/menu/UserAvatar";
import { NavMenu } from "common/components/menu/NavMenu";
import { Node } from "domain/node/Node";
import { UITree } from "domain/ui-tree/UITree";
import { GetIdeasAssistence } from "growth-exercise/components/blog-article/GetIdeasAssistence";
import { getSuggestedIdeas } from "growth-exercise/chains/getOutline";
import { saveNodes } from "common/components/outline/outlineQueries";
import { OutlineWrapper } from "common/components/outline/OutlineWrapper";
import { saveGrowthExercise } from "growth-exercise/queries";

type Props = {};

export const CreateBlogArticleView: React.FC<Props> = () => {
  const navigate = useNavigate();

  const [isGettingIdeas, setIsGettingIdeas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogPoints, setBlogPoints] = useState<string[]>([]);
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [generatedBlogTitle, setGeneratedBlogTitle] = useState("");

  const handleGetIdeas = () => {
    setIsGettingIdeas(!isGettingIdeas);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerateOutline = async () => {
    setIsLoading(true);
    const blogArticle = await getSuggestedIdeas(
      blogTitle,
      blogPoints?.join("\n")
    );

    const uiTree = new UITree([], "");
    uiTree.createNodesFromSections(blogArticle.sections);
    const nodes = uiTree.nodes || [];
    setAllNodes(nodes);

    setGeneratedBlogTitle(blogArticle.title);

    setIsLoading(false);
  };

  const handleAddBlogArticle = () => {
    const growthExerciseId = uuidv4();
    saveGrowthExercise({
      id: growthExerciseId,
      title: generatedBlogTitle,
      inputs: {
        title: blogTitle,
        about: blogPoints.join("\n"),
      },
      state: "created",
      user_id: "",
      type: "blog-article",
    }).then(() => {
      if (!growthExerciseId) {
        return;
      }
      const outlineNodesWithGrowthExerciseId = allNodes
        ?.map((node: Node) => {
          node.growth_exercise_id = growthExerciseId;
          return node;
        })
        .map((node: Node): TNode => node.toTNode());
      saveNodes(outlineNodesWithGrowthExerciseId)?.then(() => {
        navigate(`/${growthExerciseId}/execute`);
      });
    });
  };

  return (
    <Grid templateColumns="60% 40%" height="100vh">
      <GridItem colSpan={1}>
        <Box borderBottom={"1px solid #e3e3e3"}>
          <Flex justify={"space-between"}>
            <Flex mx="5%" p={"8px"} align={"center"}>
              <Box cursor={"pointer"}>
                <MdArrowBack fontSize="24px" onClick={handleBack} />
              </Box>
            </Flex>
            <Flex align={"center"}>
              <UserAvatar size="sm" />
              <NavMenu />
            </Flex>
          </Flex>
        </Box>
        <Box mx="5%">
          <Text fontSize="lg" mb={4}>
            What do you want to write about? (1-2 sentences)
          </Text>
          <Input
            backgroundColor={"white"}
            value={blogTitle}
            placeholder="What do you want to write about? (1-2 sentences)"
            mb={4}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
          <Flex justify={"space-between"}>
            <Text fontSize="lg" mb={2} mt={6}>
              What should the article cover? (5-6 sentences)
            </Text>
            <Button
              size="sm"
              ml={2}
              mt={6}
              backgroundColor="white"
              color="#0b870b"
              border="1px solid #0b870b"
              onClick={handleGetIdeas}
            >
              Get Ideas
            </Button>
          </Flex>
          <Textarea
            backgroundColor={"white"}
            mb={4}
            ml={1}
            minH="unset"
            overflow="hidden"
            w="100%"
            resize="none"
            minRows={5}
            py={0}
            as={ResizeTextarea}
            fontSize={"medium"}
            value={blogPoints.join("\n")}
            onChange={(e) => setBlogPoints(e.target.value.split("\n"))}
          />
          <Flex>
            <Button colorScheme="green" onClick={handleGenerateOutline}>
              Generate Outline
            </Button>
            {isLoading && <Spinner ml={4} />}
          </Flex>
          <Box mt="16px">
            {allNodes?.length > 0 && (
              <Box>
                <OutlineWrapper
                  suggestedGrowthExercise={{
                    id: "",
                    title: generatedBlogTitle,
                    summary: "",
                    outline: allNodes,
                  }}
                  allNodes={allNodes}
                  setAllNodes={setAllNodes}
                />
                <Box mt="16px" mb="8px">
                  <Button colorScheme="green" onClick={handleAddBlogArticle}>
                    Add Blog Article
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        {isGettingIdeas && (
          <GetIdeasAssistence
            blogTitle={blogTitle}
            blogPoints={blogPoints}
            isAdditionalPrompt={blogPoints.length > 0}
            onClose={handleGetIdeas}
          />
        )}
      </GridItem>
    </Grid>
  );
};

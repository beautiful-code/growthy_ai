import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import ResizeTextarea from "react-textarea-autosize";
import {
  Text,
  Input,
  Textarea,
  Box,
  Flex,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { GButton } from "common/components/GButton";

import { UserAvatar } from "common/components/header/UserAvatar";
import { NavMenu } from "common/components/header/NavMenu";
import { GetIdeasAssistence } from "growth-exercise/components/blog-article/GetIdeasAssistence";
import { getBlogArticleXMLSuggestion as defaultGetBlogArticleXMLSuggestion } from "growth-exercise/chains/getOutline";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { BlogArticle } from "./BlogArticle";
import { saveGrowthExercise as defaultSaveGrowthExercise } from "growth-exercise/queries";
import { TGrowthExercise } from "types";

type Props = {
  getBlogArticleXMLSuggestion?: ({
    blog_article_goal,
    blog_article_points,
  }: {
    blog_article_goal: string;
    blog_article_points: string;
  }) => Promise<string>;
  saveGrowthExercise?: (
    data: TGrowthExercise
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  onCreateGrowthExerciseCallback?: (
    growthExercise: TGrowthExercise | null,
    navigate: (path: string) => void
  ) => void;
};

const defaultOnCreateGrowthExercise = (
  growthExercise: TGrowthExercise | null,
  navigate: (path: string) => void
) => {
  if (growthExercise) {
    navigate(`/${growthExercise.id}/execute`);
  }
};

export const CreateBlogArticleView: React.FC<Props> = ({
  getBlogArticleXMLSuggestion = defaultGetBlogArticleXMLSuggestion,
  saveGrowthExercise = defaultSaveGrowthExercise,
  onCreateGrowthExerciseCallback = defaultOnCreateGrowthExercise,
}) => {
  const navigate = useNavigate();

  const [showGrowthyConversation, setShowGrowthyConversation] = useState(false);
  const [blogInputs, setBlogInputs] = useState<{
    blogTitle: string;
    blogPoints: string[];
  }>({
    blogTitle: "",
    blogPoints: [],
  });
  const [generatedBlogArticleXML, setGeneratedBlogArticleXML] = useState("");

  const { mutate: saveGrowthExerciseMutation, isPending } = useMutation({
    mutationFn: saveGrowthExercise,
    onSuccess: ({ data: growthExercise }) => {
      onCreateGrowthExerciseCallback(growthExercise, navigate);
    },
  });

  const {
    mutate: generateBlogArticleXML,
    isPending: isGettingSuggestedBlogArticle,
  } = useMutation({
    mutationFn: getBlogArticleXMLSuggestion,
    onSuccess: (data) => {
      setGeneratedBlogArticleXML(data);
    },
  });

  const generatedBlogArticle = new UIBlogArticle(generatedBlogArticleXML);

  const handleGrowthyConversation = () => {
    setShowGrowthyConversation(!showGrowthyConversation);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerateOutline = async () => {
    await generateBlogArticleXML({
      blog_article_goal: blogInputs.blogTitle,
      blog_article_points: blogInputs?.blogPoints?.join("\n"),
    });
  };

  const onBlogArticleUpdate = (blogArticle: UIBlogArticle) => {
    setGeneratedBlogArticleXML(blogArticle._xml);
  };

  const handleAddBlogArticle = () => {
    // Save to DB
    const statelessBlogArticleXML = generatedBlogArticle.getUIStatelessXML();

    saveGrowthExerciseMutation({
      xml_text: statelessBlogArticleXML,
      inputs: {
        title: blogInputs.blogTitle,
        points: blogInputs.blogPoints,
      },
      state: "created",
      type: "blog-article",
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
            value={blogInputs.blogTitle}
            placeholder="What do you want to write about? (1-2 sentences)"
            mb={4}
            onChange={(e) =>
              setBlogInputs({ ...blogInputs, blogTitle: e.target.value })
            }
          />
          <Flex justify={"space-between"}>
            <Text fontSize="lg" mb={2} mt={6}>
              What should the article cover? (5-6 sentences)
            </Text>
            <GButton
              size="sm"
              ml={2}
              mt={6}
              type="secondary"
              onClick={handleGrowthyConversation}
            >
              Get Ideas
            </GButton>
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
            value={blogInputs.blogPoints.join("\n")}
            onChange={(e) =>
              setBlogInputs({
                ...blogInputs,
                blogPoints: e.target.value.split("\n"),
              })
            }
          />
          <Flex>
            <GButton type="primary" onClick={handleGenerateOutline}>
              Generate Outline
            </GButton>
            {isGettingSuggestedBlogArticle && <Spinner ml={4} />}
          </Flex>

          <Box mt={4}>
            {generatedBlogArticleXML && (
              <BlogArticle
                isAddingBlogArticle={isPending}
                blogArticle={generatedBlogArticle}
                onBlogArticleUpdate={onBlogArticleUpdate}
                handleAddBlogArticle={handleAddBlogArticle}
              />
            )}
          </Box>
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        {showGrowthyConversation && (
          <GetIdeasAssistence
            blogTitle={blogInputs.blogTitle}
            blogPoints={blogInputs.blogPoints}
            isAdditionalPrompt={blogInputs.blogPoints.length > 0}
            onClose={handleGrowthyConversation}
          />
        )}
      </GridItem>
    </Grid>
  );
};

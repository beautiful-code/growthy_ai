import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

type Props = {
  getBlogArticleXMLSuggestion?: (
    blog_article_goal: string,
    blog_article_points: string
  ) => Promise<string>;
};

export const CreateBlogArticleView: React.FC<Props> = ({
  getBlogArticleXMLSuggestion = defaultGetBlogArticleXMLSuggestion,
}) => {
  const navigate = useNavigate();

  const [showGrowthyConversation, setShowGrowthyConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogInputs, setBlogInputs] = useState<{
    blogTitle: string;
    blogPoints: string[];
  }>({
    blogTitle: "",
    blogPoints: [],
  });

  const [generatedBlogArticleXML, setGeneratedBlogArticleXML] = useState("");

  const generatedBlogArticle = new UIBlogArticle(generatedBlogArticleXML);

  const handleGrowthyConversation = () => {
    setShowGrowthyConversation(!showGrowthyConversation);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerateOutline = async () => {
    setIsLoading(true);
    const suggestedBlogArticleML = await getBlogArticleXMLSuggestion(
      blogInputs.blogTitle,
      blogInputs?.blogPoints?.join("\n")
    );

    setGeneratedBlogArticleXML(suggestedBlogArticleML);

    setIsLoading(false);
  };

  const onBlogArticleUpdate = () => {
    setGeneratedBlogArticleXML(generatedBlogArticle._xml);
  };

  const handleAddBlogArticle = () => {
    // Save to DB
    const statelessBlogArticleXML = generatedBlogArticle.getUIStatelessXML();
    console.log(statelessBlogArticleXML);
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
            {isLoading && <Spinner ml={4} />}
          </Flex>

          <Box mt={4}>
            {generatedBlogArticleXML && (
              <BlogArticle
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

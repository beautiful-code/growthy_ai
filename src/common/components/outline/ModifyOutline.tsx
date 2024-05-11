import { Flex, Box, Text, Textarea, Spinner, Button } from "@chakra-ui/react";
import {
  useNavigate,
  useParams as useDefaultUseParams,
} from "react-router-dom";
import { Header } from "../header/Header";
import { UIBlogArticle } from "domain/blog-article/UIBlogArticle";
import { useGetExercise } from "execute/hooks/useGetExercise";
import { getExercise as defaultGetExercise } from "execute/queries";
import { useEffect, useRef, useState } from "react";
import { SkeletonScreen } from "../SkeletonScreen";
import { PostgrestError } from "@supabase/supabase-js";
import { TGrowthExercise } from "types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UIOutline } from "domain/common/UIOutline";
import { Outline } from "./Outline";
import { saveGrowthExercise as defaultSaveGrowthExercise } from "growth-exercise/queries";
import { FaArrowLeft } from "react-icons/fa";
import ResizeTextarea from "react-textarea-autosize";
import { getBlogArticleXMLSuggestion as defaultGetBlogArticleXMLSuggestion } from "growth-exercise/chains/getOutline";

export type ModifyOutlineProps = {
  getBlogArticleXMLSuggestion?: ({
    blog_article_goal,
    blog_article_points,
  }: {
    blog_article_goal: string;
    blog_article_points?: string;
  }) => Promise<string>;
  useParams?: () => { growthExerciseId: string };
  getExercise?: (
    id: string
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
  saveGrowthExercise?: (
    data: TGrowthExercise
  ) => Promise<{ data: TGrowthExercise | null; error: PostgrestError | null }>;
};

export const ModifyOutline: React.FC<ModifyOutlineProps> = ({
  useParams = useDefaultUseParams,
  getExercise = defaultGetExercise,
  saveGrowthExercise = defaultSaveGrowthExercise,
  getBlogArticleXMLSuggestion = defaultGetBlogArticleXMLSuggestion,
}) => {
  const { growthExerciseId = "" } = useParams<{ growthExerciseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [updateBlogInput, setUpdateBlogInput] = useState<string>("");

  const [orginalBlogXML, setOrginalBlogXML] = useState("");
  const [updatedBlogXML, setUpdatedBlogXML] = useState("");

  const {
    data: updatedBlogXMLData,
    refetch: refetchSuggestedBlogXML,
    isFetching: isFetchingSuggestedBlogXML,
  } = useQuery({
    queryKey: ["getBlogArticleXMLSuggestion"],
    queryFn: () =>
      getBlogArticleXMLSuggestion({
        blog_article_goal: updateBlogInput,
      }),
    enabled: false,
  });

  useEffect(() => {
    if (updatedBlogXMLData) {
      setUpdatedBlogXML(updatedBlogXMLData);
    }
  }, [updatedBlogXMLData]);

  const { mutate: saveGrowthExerciseMutation } = useMutation({
    mutationFn: saveGrowthExercise,
  });

  const { exercise, isLoading } = useGetExercise(
    growthExerciseId || "",
    getExercise
  );

  useEffect(() => {
    if (exercise?.xml_text) {
      setOrginalBlogXML(exercise.xml_text);
    }
  }, [exercise?.xml_text]);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleGenerateOutline = async () => {
    refetchSuggestedBlogXML();
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGenerateOutline();
    }
  };

  if (isLoading || !orginalBlogXML) {
    return <SkeletonScreen />;
  }

  const originalBlogArticle = new UIBlogArticle(orginalBlogXML || "");
  const updatedBlogArticle = new UIBlogArticle(updatedBlogXML || "");

  const handleOutlineUpdate = (uiOutline: UIOutline) => {
    if (uiOutline === originalBlogArticle.getOutline()) return;
    originalBlogArticle.updateOutline(uiOutline);
    setOrginalBlogXML(originalBlogArticle._xml);

    // Persist in DB
    saveGrowthExerciseMutation({
      ...exercise,
      inputs: exercise?.inputs || {},
      state: exercise?.state || "created",
      type: "blog-article",
      xml_text: originalBlogArticle.getUIStatelessXML(),
    });
  };

  const handleUpdatedOutlineUpdate = (uiOutline: UIOutline) => {
    updatedBlogArticle.updateOutline(uiOutline);
    setUpdatedBlogXML(updatedBlogArticle._xml);
  };

  const handleReject = () => {
    setUpdatedBlogXML("");
    queryClient.invalidateQueries({
      queryKey: ["getBlogArticleXMLSuggestion"],
    }); // clear react query cache of updated outline
    inputRef.current?.focus();
  };

  const handleAccept = () => {
    const outline = updatedBlogArticle.getOutline();
    if (outline) {
      handleOutlineUpdate(outline);
    }
    inputRef.current?.focus();
  };

  return (
    <>
      <Box p="4px" borderBottom={"1px solid #e3e3e3"}>
        <Header showAvatar={false}>
          <Flex ml="24px" align="center">
            <FaArrowLeft cursor="pointer" onClick={handleNavigateBack} />
            <Text ml="8px">{originalBlogArticle?.getTitle()}</Text>
          </Flex>
        </Header>
      </Box>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        my={"30px"}
      >
        <Textarea
          ref={inputRef}
          ml={1}
          minH="unset"
          overflow="hidden"
          w="60%"
          resize="none"
          minRows={1}
          py={1}
          as={ResizeTextarea}
          fontSize={"medium"}
          placeholder="Tell Growthy what changes you want to make to the outline"
          value={updateBlogInput}
          onChange={(e) => setUpdateBlogInput(e.target.value)}
          border={"2px solid grey"}
          onKeyDown={handleKeyDown}
        />
        {isFetchingSuggestedBlogXML && <Spinner ml={4} />}
      </Flex>

      <Flex width="100%" my={"50px"}>
        <Box width="25%" mx={"10%"}>
          <Text fontSize={"md"} fontWeight={"bold"} mb={"20px"}>
            Current Outline
          </Text>
          <Outline
            uiOutline={originalBlogArticle.getOutline()}
            onUpdateOutlineCallback={handleOutlineUpdate}
            alwaysExpand
            checkingEnabled
            allowExpand={false}
          />
        </Box>

        <Box width="25%" mx={"10%"}>
          <Text fontSize={"md"} fontWeight={"bold"} mb={"20px"}>
            Updated Outline
          </Text>
          <Outline
            uiOutline={updatedBlogArticle.getOutline()}
            onUpdateOutlineCallback={handleUpdatedOutlineUpdate}
            alwaysExpand
            checkingEnabled
            allowExpand={false}
          />
        </Box>
      </Flex>

      <Flex width="100%" pb={"80px"}>
        <Button
          color={"green"}
          borderColor={"green"}
          bgColor={"white"}
          _hover={{ color: "white", bgColor: "green.500" }}
          onClick={handleAccept}
          p={1}
          w={"7%"}
          h={"5%"}
          ml={"35%"}
        >
          Accept
        </Button>

        <Button
          color={"red"}
          borderColor={"red"}
          bgColor={"white"}
          _hover={{ color: "white", bgColor: "red.500" }}
          p={1}
          w={"7%"}
          h={"5%"}
          ml={"5%"}
          onClick={handleReject}
        >
          Reject
        </Button>
      </Flex>
    </>
  );
};

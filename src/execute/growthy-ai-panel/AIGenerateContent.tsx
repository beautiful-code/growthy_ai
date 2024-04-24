import React from "react";
import {
  Box,
  Flex,
  Text,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";

import { MarkdownEditor } from "common/components/MarkdownEditor";
import { useGenerateContent } from "execute/hooks/useGenerateContent";

type Props = {
  blogArticleInputs: {
    blog_article_goal: string;
    blog_article_xml: string;
  };
  growthyAIDrawerType: "growthy-conversation" | "generate-content" | "";
  handleGrowthyAIDrawerType: (
    type: "growthy-conversation" | "generate-content" | ""
  ) => void;
};

export const AIGenerateContent: React.FC<Props> = ({
  blogArticleInputs,
  growthyAIDrawerType,
  handleGrowthyAIDrawerType,
}) => {
  const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();

  const { uiBlogArticle, isFetching, refetch } =
    useGenerateContent(blogArticleInputs);

  const onClose = () => {
    handleGrowthyAIDrawerType("");
  };

  console.log(uiBlogArticle);

  const handlreGenerate = () => {
    refetch();
    onDisclosureClose();
  };

  const outline = uiBlogArticle?.getOutline();
  const sections = outline?.getSections();

  console.log({ outline, sections });

  return (
    <div>
      <Box
        p="4px"
        height={"calc(100vh - 50px)" || "100vh"}
        overflowX={"hidden"}
        overflowY={"auto"}
        backgroundColor={
          growthyAIDrawerType === "growthy-conversation"
            ? "#F0FAF0B2"
            : "#F5F5F5"
        }
      >
        <Flex mt="16px" mr="8px" justify={"flex-end"}>
          {growthyAIDrawerType === "generate-content" && (
            <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
              <MenuButton>
                <FaEllipsisVertical />
              </MenuButton>
              <MenuList p={4}>
                <Stack spacing={1}>
                  <Text cursor={"pointer"} onClick={handlreGenerate}>
                    Regenarate Content
                  </Text>
                  <Text
                    cursor={"pointer"}
                    // onClick={handleClearContent}
                  >
                    Clear Content
                  </Text>
                </Stack>
              </MenuList>
            </Menu>
          )}
          <MdClose cursor={"pointer"} onClick={onClose} />
        </Flex>
        {isFetching ? (
          <Flex width={"100%"} justify={"center"}>
            <Spinner size="md" />
          </Flex>
        ) : (
          <Box>
            {sections?.map((section, index) => {
              return (
                <Box key={index} p="8px">
                  <Text fontSize="xl">{section.getSectionName()}</Text>
                  <Box>
                    {section.getUITasks().map((task, index) => {
                      console.log(task.getContent());
                      return (
                        <Box key={index} p="8px">
                          <Text fontSize="md">{task.getText()}</Text>
                          <MarkdownEditor
                            markdown={task.getContent()}
                            onChange={(value) => {
                              console.log({ value });
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </div>
  );
};

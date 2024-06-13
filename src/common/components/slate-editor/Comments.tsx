import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { BaseRange } from "slate";
import { ReactEditor } from "slate-react";
import {
  Box,
  Portal,
  Textarea,
  Text,
  Avatar,
  Flex,
  Button,
} from "@chakra-ui/react";
import { CustomElement } from "./SlateEditor";
import {
  getEditorComments,
  saveEditorComments,
  updateEditorComment,
} from "common/queries";
import { useGetCurrentUser } from "my-growthy/hooks";
import { TUser } from "types";
import { v4 as uuid } from "uuid";

type CommentsProps = {
  editor: ReactEditor;
};

export type TComment = {
  dbId?: string;
  commentId: string;
  text: string;
  author: TUser;
  enableReply: boolean;
};

type TSelection = {
  selection: BaseRange;
  commentId: string;
};

type TPosition = {
  top: number;
  left: number;
  commentId: string;
};

export const Comments: React.FC<CommentsProps> = ({ editor }) => {
  const [positions, setPositions] = useState<TPosition[]>([]);
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [visibleReply, setVisibleReply] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [, setComments] = useState<TComment[]>([]);
  const [commentIdAndCommentsMap, setCommentIdAndCommentsMap] = useState<{
    [key: string]: TComment[];
  }>({});

  const commentsRef = useRef<TComment[]>([]);
  const editRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const replyRefs = useRef<{ [key: string]: string }>({});

  const commentIds: string[] = useMemo(() => {
    return [];
  }, []);

  const { currentUser } = useGetCurrentUser();

  const fetchComments = useCallback(async (commentIds: string[]) => {
    const allComments: TComment[] = [];
    for (const commentId of commentIds) {
      const newComments: TComment[] = [];
      const comment = await getEditorComments(commentId);
      if (comment.data) {
        comment.data.forEach((c) => {
          newComments.push({
            commentId,
            text: c.text,
            author: c.author,
            enableReply: c.enableReply,
            dbId: c.dbId,
          });
        });
      }

      if (newComments.length > 0 && newComments[0].text.length === 0) {
        setEditModes((prevEditModes) => ({
          ...prevEditModes,
          [newComments[0].dbId || ""]: true,
        }));
      }

      setCommentIdAndCommentsMap((prev) => ({
        ...prev,
        [commentId]: newComments,
      }));
      allComments.push(...newComments);
    }

    if (allComments.length > 0) {
      commentsRef.current = [...commentsRef.current, ...allComments];
      setComments(commentsRef.current);
    }
  }, []);

  const updatePositions = useCallback(() => {
    try {
      const selections: TSelection[] = [];
      const newPositions: TPosition[] = [];
      const children = editor.children;
      commentIds.length = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as CustomElement;
        child.children.forEach((ch, index) => {
          if (ch.comment) {
            commentIds.push(ch.comment);
            selections.push({
              selection: {
                anchor: { path: [i, index], offset: 0 },
                focus: { path: [i, index], offset: 0 },
              },
              commentId: ch.comment,
            });
          }
        });
      }

      selections.forEach((sel) => {
        const domRange = ReactEditor.toDOMRange(editor, sel.selection);
        const rect = domRange.getBoundingClientRect();

        let top = rect.top - 40 + window.scrollY;
        const left = rect.right + window.scrollX;

        for (let i = 0; i < newPositions.length; i++) {
          const pos = newPositions[i];
          if (Math.abs(pos.top - top) < 75) {
            top = pos.top + 50 + 50; //50px gap between comments
          }
        }

        newPositions.push({ top, left, commentId: sel.commentId });
      });
      setPositions(newPositions);
    } catch (error) {
      console.error("Error while updating comment positions:", error);
    }
  }, [commentIds, editor]);

  useEffect(() => {
    updatePositions();
    fetchComments(commentIds);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Backspace") {
        updatePositions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [commentIds, editor.selection, fetchComments, updatePositions]);

  const handleEditClick = (commentDbId: string) => {
    editRefs.current[commentDbId]?.focus();
    setEditModes((prevEditModes) => ({
      ...prevEditModes,
      [commentDbId]: !prevEditModes[commentDbId],
    }));
  };

  const handleReply = async (commentId: string) => {
    const replyDbId = uuid();

    // Hide the reply input box
    setVisibleReply((prevVisibleReply) => ({
      ...prevVisibleReply,
      [commentId]: false,
    }));

    const replyText = replyRefs.current[commentId];

    // Update the map with the new reply
    setCommentIdAndCommentsMap((prev) => ({
      ...prev,
      [commentId]: [
        ...prev[commentId],
        {
          commentId,
          text: replyText,
          author: currentUser,
          enableReply: false,
          dbId: replyDbId,
        },
      ],
    }));

    // Save the reply
    await saveEditorComments([
      {
        commentId,
        text: replyText,
        author: currentUser,
        enableReply: false,
        dbId: replyDbId,
      },
    ]);

    // Fetch the latest comments
    await fetchComments(commentIds);
  };

  const handleReplyChange = (commentId: string, text: string) => {
    replyRefs.current[commentId] = text;
  };

  const handleReplyKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    commentId: string
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleReply(commentId);
    }
  };

  const handleCommentKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    commentDbId: string,
    commentId: string
  ) => {
    if (event.key === "Enter") {
      updateEditorComment({
        commentId,
        text: editRefs.current[commentDbId]?.value || "",
        dbId: commentDbId,
        author: currentUser,
        enableReply: false,
      } as TComment);

      setEditModes((prevEditModes) => ({
        ...prevEditModes,
        [commentDbId]: !prevEditModes[commentDbId],
      }));
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {Object.entries(commentIdAndCommentsMap).map(([commentId, comments]) => (
        <Portal key={commentId}>
          <Box
            style={{
              position: "absolute",
              top: `${positions.find((p) => p.commentId === commentId)?.top}px`,
              left: `70%`,
              padding: "5px",
              zIndex: 10,
              width: "400px",
            }}
            backgroundColor={"gray.100"}
            border={"1px solid whitesmoke"}
            borderRadius={15}
          >
            {comments.map((comment) => (
              <React.Fragment key={comment.dbId}>
                <Flex alignItems={"center"} my={"10px"} mx={"10px"} mr={"30px"}>
                  <Avatar
                    size={"sm"}
                    name={comment?.author.username}
                    src={comment?.author.avatar_url}
                    bgColor={"#D9D9D9"}
                    mr={2}
                  />
                  <Text fontSize="sm" fontWeight={"normal"}>
                    {comment?.author.username}
                  </Text>
                  {currentUser.id === comment.author.id &&
                    !editModes[comment.dbId || ""] && (
                      <Button
                        p={2}
                        ml={"20px"}
                        onClick={() => handleEditClick(comment.dbId || "")}
                      >
                        Edit
                      </Button>
                    )}
                </Flex>

                <Textarea
                  placeholder="Add a comment..."
                  resize="none"
                  focusBorderColor="black.500"
                  defaultValue={comment?.text || ""}
                  isReadOnly={!editModes[comment.dbId || ""]}
                  border={"none"}
                  _hover={{
                    backgroundColor:
                      !editModes[comment.dbId || ""] && "gray.200",
                  }}
                  borderRadius={15}
                  ref={(el) => (editRefs.current[comment.dbId || ""] = el)}
                  onClick={() => {
                    if (!editModes[comment.dbId || ""]) {
                      setVisibleReply((prev) => ({
                        ...prev,
                        [commentId]: !prev[commentId],
                      }));
                    }
                  }}
                  cursor={!editModes[comment.dbId || ""] ? "pointer" : "auto"}
                  onKeyDown={(e) =>
                    handleCommentKeyDown(e, comment.dbId || "", commentId)
                  }
                />
              </React.Fragment>
            ))}

            {visibleReply[commentId] && (
              <Textarea
                placeholder="Add a reply..."
                resize="none"
                focusBorderColor="black.500"
                borderRadius={15}
                mt={"10px"}
                backgroundColor={"white"}
                onChange={(e) => handleReplyChange(commentId, e.target.value)}
                onKeyDown={(e) => handleReplyKeyDown(e, commentId)}
              />
            )}
          </Box>
        </Portal>
      ))}
    </div>
  );
};

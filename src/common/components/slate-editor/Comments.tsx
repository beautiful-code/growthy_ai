import React, { useEffect, useState, useCallback, useRef } from "react";
import { BaseRange } from "slate";
import { ReactEditor } from "slate-react";
import { Portal, Textarea } from "@chakra-ui/react";
import { CustomElement } from "./SlateEditor";
import { getEditorComment, saveEditorComments } from "common/queries";
import { useGetCurrentUserId } from "common/hooks/useGetCurrentUserId";

type CommentsProps = {
  editor: ReactEditor;
};

export type TComment = {
  commentId: string;
  text: string;
  authorId: string;
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
  const [comments, setComments] = useState<TComment[]>([]);
  const commentsRef = useRef<TComment[]>([]);
  const { currentUserId } = useGetCurrentUserId();
  console.log("currentUserId", currentUserId);
  const fetchComments = useCallback(async (commentIds: string[]) => {
    const newComments: TComment[] = [];

    for (const commentId of commentIds) {
      const commentExists = commentsRef.current.some(
        (c) => c.commentId === commentId
      );
      if (!commentExists) {
        const comment = await getEditorComment(commentId);
        if (comment.data) {
          console.log("comment.data", comment.data);
          newComments.push({
            commentId,
            text: comment.data.text,
            authorId: comment.data.author,
          });
        }
      }
    }

    if (newComments.length > 0) {
      commentsRef.current = [...commentsRef.current, ...newComments];
      setComments(commentsRef.current);
    }
  }, []);

  const updatePositions = useCallback(() => {
    try {
      const selections: TSelection[] = [];
      const newPositions: TPosition[] = [];
      const children = editor.children;

      const commentIds: string[] = [];

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

      fetchComments(commentIds);

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
  }, [editor, fetchComments]);

  useEffect(() => {
    updatePositions();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Backspace") {
        updatePositions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor.selection, updatePositions]);

  const handleCommentChange = (commentId: string, text: string) => {
    const updatedComments = commentsRef.current.map((c) =>
      c.commentId === commentId ? { commentId, text, authorId: c.authorId } : c
    );
    commentsRef.current = updatedComments;
    setComments(updatedComments);
    saveEditorComments(updatedComments);
  };

  console.log("commentsRef.current", commentsRef.current, comments);

  return (
    <div style={{ position: "relative" }}>
      {positions.map((position, index) => (
        <Portal key={index}>
          <div
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `70%`,
              backgroundColor: "white",
              padding: "5px",
              zIndex: 10,
            }}
          >
            <Textarea
              placeholder="Add a comment..."
              resize="none"
              focusBorderColor="black.500"
              value={
                comments.find((c) => c.commentId === position.commentId)
                  ?.text || ""
              }
              onChange={(e) =>
                handleCommentChange(position.commentId, e.target.value)
              }
              isReadOnly={
                currentUserId !==
                comments.find((c) => c.commentId === position.commentId)
                  ?.authorId
              }
            />
          </div>
        </Portal>
      ))}
    </div>
  );
};

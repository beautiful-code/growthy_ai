import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { updateTaskContent as defaultUpdateTaskContent } from "execute/queries";

type TUseSaveContent = {
  updateTaskContentMutation: UseMutateFunction<any, unknown, any>;
  isPending: boolean;
};

export const useUpdateTaskContent = ({
  updateTaskContent = defaultUpdateTaskContent,
  onSuccess = () => {},
}): TUseSaveContent => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateTaskContent,
    onSuccess,
  });

  return { updateTaskContentMutation: mutate, isPending };
};

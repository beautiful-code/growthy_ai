import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { saveBulkTasksContent as defaultSaveBulkTasksContent } from "execute/queries";

type TUseSaveContent = {
  saveBulkTasksContentMutation: UseMutateFunction<any, unknown, any>;
  isPending: boolean;
};

export const useSaveContent = ({
  saveBulkTasksContent = defaultSaveBulkTasksContent,
  onSuccess = () => {},
}): TUseSaveContent => {
  const { mutate, isPending } = useMutation({
    mutationFn: saveBulkTasksContent,
    onSuccess,
  });

  return { saveBulkTasksContentMutation: mutate, isPending };
};

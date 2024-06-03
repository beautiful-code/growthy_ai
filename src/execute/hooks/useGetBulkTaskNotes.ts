import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";

import { TTaskNote } from "types";
import { getBulkTaskNotes as defaultGetBulkTaskNotes } from "execute/queries";

export const useGetBulkTaskNotes = (
  ids: string[],
  getBulkTaskNotes: (ids: string[]) => Promise<{
    data: TTaskNote[];
    error: PostgrestError | null;
  }> = defaultGetBulkTaskNotes
): {
  data: TTaskNote[];
  isLoading: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bulk-task-notes", ids?.join(",")],
    queryFn: () => getBulkTaskNotes(ids),
  });

  return { data: data?.data || [], isLoading, refetch };
};

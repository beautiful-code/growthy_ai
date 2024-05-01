import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";

import { TGrowthyConversation } from "types";

import { getPersistedConversations as defaultGetPersistedConversations } from "common/queries";

type TUseGetExercise = {
  persistedConversations: TGrowthyConversation[];
  isLoading: boolean;
  refetch: () => void;
};

export const useGetPersistedConversations = (
  id: string,
  getPersistedConversation: (id: string) => Promise<{
    data: TGrowthyConversation[];
    error: PostgrestError | null;
  }> = defaultGetPersistedConversations
): TUseGetExercise => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["growthy_conversation", id],
    queryFn: () => getPersistedConversation(id),
    gcTime: 0,
  });

  return { persistedConversations: data?.data || [], isLoading, refetch };
};

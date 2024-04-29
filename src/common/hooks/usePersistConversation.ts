// mutation hook that updates a conversation in db

import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { TGrowthyConversation } from "types";
import { persistConversation as defaultPersistConversation } from "common/queries";

type TUsePersistConversation = {
  persistConversationMutation: UseMutateFunction<
    {
      data: TGrowthyConversation | null;
      error: PostgrestError | null;
    },
    unknown,
    TGrowthyConversation
  >;
  isPending: boolean;
};

export const usePersistConversation = (
  persistConversation = defaultPersistConversation
): TUsePersistConversation => {
  const { mutate, isPending } = useMutation({
    mutationFn: persistConversation,
  });

  return { persistConversationMutation: mutate, isPending };
};

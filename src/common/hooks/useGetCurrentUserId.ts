import { useQuery } from "@tanstack/react-query";
import { getCurrentUserId } from "common/queries";

type TUseGetCurrentUserId = {
  currentUserId: string;
};

export const useGetCurrentUserId = (): TUseGetCurrentUserId => {
  const { data } = useQuery({
    queryKey: ["getCurrentUserId"],
    queryFn: () => getCurrentUserId(),
  });

  return { currentUserId: data || "" };
};

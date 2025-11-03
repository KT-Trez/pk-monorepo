import { useQuery } from '@tanstack/react-query';
import { EMPTY_ARRAY } from '@/constants/fallback.ts';
import { useTRPC } from '@/utils/trpc.ts';

export const useUsersFetch = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.v1.user.userList.queryOptions());

  return {
    data: data ?? EMPTY_ARRAY,
    isLoading,
  };
};

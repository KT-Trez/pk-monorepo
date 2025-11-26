import { useQuery } from '@tanstack/react-query';
import { EMPTY_ARRAY } from '@/constants/fallback.ts';
import { useTRPC } from '@/utils/trpc.ts';

export const useCalendarsFetch = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.v1.calendar.calendarList.queryOptions());

  return {
    data: data ?? EMPTY_ARRAY,
    isLoading,
  };
};

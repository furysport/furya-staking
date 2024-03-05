import { useMemo } from 'react';
import { useQueries } from 'react-query';

import { fetchTotalStakedBalances } from 'hooks/useGetTotalStakedBalances';
import useLCDClient from 'hooks/useLCDClient';
import { debounce } from 'lodash';

export const useAssetsData = () => {
  const client = useLCDClient();
  const queries = useQueries([{
    queryKey: 'totalStakeBalances',
    queryFn: () => fetchTotalStakedBalances(client),
    enabled: Boolean(client),
  }]);

  const isLoading = useMemo(() => queries.some(query => query.isLoading || !query.data), [queries]);
  
  const debouncedRefetch = useMemo(() => debounce((refetchFunc) => refetchFunc(), 500), []);
  
  const refetchAll = () => {
    queries.forEach((query) => {
      debouncedRefetch(query.refetch);
    });
  };

  // Since we're not fetching 'vtRewardShares', it's no longer included in the data memoization
  const data = useMemo(() => queries[0].data, [queries]);

  return {
    ...data,
    isLoading,
    refetch: refetchAll,
  };
};

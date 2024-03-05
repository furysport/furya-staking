import { useMemo } from 'react';
import { useQueries } from 'react-query';

import { fetchTotalStakedBalances } from 'hooks/useGetTotalStakedBalances';
import useLCDClient from 'hooks/useLCDClient';
import { debounce } from 'lodash'

export const useAssetsData = () => {
  const client = useLCDClient()
  const queries = useQueries([{
    queryKey: 'totalStakeBalances',
    queryFn: () => fetchTotalStakedBalances(client),
    enabled: Boolean(client),
  }]) // Removed the 'vtRewardShares' query

  const isLoading = useMemo(() => queries.some((query) => (
    query.isLoading || !query.data
  )),
  [queries])
  const debouncedRefetch = useMemo(() => debounce((refetchFunc) => refetchFunc(), 500),
    [])
  const refetchAll = () => {
    queries.forEach((query) => {
      debouncedRefetch(query.refetch)
    })
  }

  const data = useMemo(() => {
    const totalStakedBalances = queries[0].data
    // Since we're no longer fetching 'vtRewardShares', we don't merge it here
    return {
      ...totalStakedBalances
    }
  }, [queries])

  return { 
    ...data,
    isLoading,
    refetch: refetchAll 
  }
}

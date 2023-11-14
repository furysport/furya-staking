import { useMemo } from 'react';
import { useQueries } from 'react-query';

import useClient from 'hooks/useClient';
import { fetchTotalStakedBalances } from 'hooks/useGetTotalStakedBalances';
import { fetchVTRewardShares } from 'hooks/useGetVTRewardShares';
import { debounce } from 'lodash'

export const useAssetsData = () => {
  const client = useClient()
  const queries = useQueries([{
    queryKey: 'totalStakeBalances',
    queryFn: () => fetchTotalStakedBalances(client),
    enabled: Boolean(client),
  }, {
    queryKey: 'vtRewardShares',
    queryFn: () => fetchVTRewardShares(client),
    enabled: Boolean(client),
  }])

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
    const rewardShares = queries[1].data
    return {
      ...totalStakedBalances,
      ...rewardShares,
    }
  }, [queries])

  return { ...data,
    isLoading,
    refetch: refetchAll }
}

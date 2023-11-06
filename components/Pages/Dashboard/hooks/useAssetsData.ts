import {useQueries} from "react-query";
import {fetchTotalStakedBalances} from "hooks/useGetTotalStakedBalances";
import usePrices from "hooks/usePrices";
import {fetchVTRewardShares} from "hooks/useGetVTRewardShares";
import {useMemo} from "react";
import useClient from "hooks/useClient";
import { debounce } from 'lodash'

export const useAssetsData = () => {
    const [priceList] = usePrices() || []
    const client = useClient()
    const queries = useQueries([{
        queryKey: 'totalStakeBalances',
        queryFn: () => fetchTotalStakedBalances(client),
        enabled: !!client,
    },{
        queryKey: 'vtRewardShares',
        queryFn: () => fetchVTRewardShares(client),
        enabled: !!client,
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
        const bondedData = queries[0].data
        const unbondingData = queries[1].data
        const withdrawableData = queries[2].data
        return {
            ...bondedData,
            ...unbondingData,
            ...withdrawableData,
        }
    }, [queries])

    return { ...data,
        isLoading,
        refetch: refetchAll }

}

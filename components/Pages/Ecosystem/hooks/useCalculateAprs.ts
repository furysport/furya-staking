import { useEffect, useMemo, useState } from 'react';

import { useGetLPTokenPrice } from 'hooks/useGetLPTokenPrice';
import { useGetTotalStakedBalances } from 'hooks/useGetTotalStakedBalances';
import { useGetVTRewardShares } from 'hooks/useGetVTRewardShares';
import usePrices from 'hooks/usePrices';
import { useTotalYearlyWhaleEmission } from 'hooks/useWhaleInfo';
import { getTokenPrice } from 'util/getTokenPrice';

export interface Apr {
    name: string
    apr: number
    weight?: number
}
export const useCalculateAprs = () => {
  const [aprs, setAprs] = useState<Apr[]>([])
  const { totalStakedBalances } = useGetTotalStakedBalances()
  const { vtRewardShares } = useGetVTRewardShares()
  const { totalYearlyWhaleEmission } = useTotalYearlyWhaleEmission()
  const vtEmission = useMemo(() => 0.05 / 1.1 * totalYearlyWhaleEmission, [totalYearlyWhaleEmission])
  const [priceList] = usePrices() || []
  const { lpTokenPrice } = useGetLPTokenPrice()

  useEffect(() => {
    if (!totalStakedBalances || !vtRewardShares || !vtEmission || !priceList || !lpTokenPrice) {
      return
    }
    setAprs(vtRewardShares?.map((info) => {
      const stakedBalance = totalStakedBalances?.find((balance) => balance.denom === info.denom)
      const stakedTokenPrice = getTokenPrice(
        stakedBalance, priceList, lpTokenPrice,
      )
      return {
        name: info.tokenSymbol,
        apr: (info.distribution * vtEmission * priceList.Whale / ((stakedBalance?.totalAmount || 0) * stakedTokenPrice)) * 100,
      } as Apr
    }))
  }, [vtEmission, totalStakedBalances, vtRewardShares, priceList, lpTokenPrice])

  return aprs
}

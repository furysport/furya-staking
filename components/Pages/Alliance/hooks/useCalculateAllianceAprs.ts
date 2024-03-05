import { useMemo } from 'react';

import { Token } from 'components/Pages/AssetOverview';
import { Apr } from 'components/Pages/Ecosystem/hooks/useCalculateAprs';
import { useAlliances } from 'hooks/useAlliances';
import { useTotalYearlyFuryEmission } from 'hooks/useFuryInfo';
import usePrices from 'hooks/usePrices';
import useValidators from 'hooks/useValidators';

export const useCalculateAllianceAprs = ({ address }) => {
  const { totalYearlyFuryEmission } = useTotalYearlyFuryEmission()
  const { alliances: allianceData } = useAlliances()

  const { data: validatorData } = useValidators({ address });
  const [priceList] = usePrices() || []
  const furyPrice = priceList?.Fury

  const alliances = useMemo(() => allianceData?.alliances || [],
    [allianceData?.alliances])

  const summedAllianceWeights = useMemo(() => (alliances?.
    map((alliance) => Number(alliance?.weight))?.
    reduce((acc, e) => acc + (isNaN(e) ? 0 : e), 0) ?? 0) + 0.05, // 5% for VT,
  [alliances])

  const allianceAPRs : Apr[] = useMemo(() => alliances?.map((alliance) => {
    if (alliance.name === Token.FURY) {
      const apr = Number(((totalYearlyFuryEmission * (1 - summedAllianceWeights)) /
                        (validatorData?.stakedFury || 0)) *
                    100)
      return {
        name: Token.FURY,
        apr,
        weight: 1 - summedAllianceWeights || 1,
      };
    } else {
      const apr = !isNaN(alliance.totalDollarAmount)
        ? ((totalYearlyFuryEmission * furyPrice * (alliance?.weight || 0)) /
                        (alliance?.totalDollarAmount || 1)) *
                    100
        : 0;
      return {
        name: alliance.name,
        apr,
        weight: alliance?.weight,
      }
    }
  }), [alliances, totalYearlyFuryEmission, furyPrice])

  return allianceAPRs || []
}

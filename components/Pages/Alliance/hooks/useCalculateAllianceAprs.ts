import {useMemo} from "react";
import {useTotalYearlyWhaleEmission} from "hooks/useWhaleInfo";
import useValidators from "hooks/useValidators";
import useUndelegations from "hooks/useUndelegations";
import usePrices from "hooks/usePrices";
import {useAlliances} from "hooks/useAlliances";
import {Apr} from "components/Pages/Ecosystem/hooks/useCalculateAprs";

export const useCalculateAllianceAprs = ({address}) => {
    const {totalYearlyWhaleEmission} = useTotalYearlyWhaleEmission()
    const {alliances: allianceData} = useAlliances()

    const {data: validatorData} = useValidators({address});
    const [priceList] = usePrices() || []
    const whalePrice = priceList?.['Whale']

    const alliances = useMemo(
        () => allianceData?.alliances || [],
        [allianceData?.alliances],
    )

    const {data: undelegationData} = useUndelegations({address})
    const undelegations = useMemo(
        () => undelegationData?.undelegations || [],
        [undelegationData],
    )
    const summedAllianceWeights = useMemo(
        () =>
            alliances
                ?.map((alliance) => {
                    return Number(alliance?.weight)
                })
                ?.reduce((acc, e) => acc + (isNaN(e) ? 0 : e), 0),
        [alliances],
    )
    const allianceAPRs : Apr[] = useMemo(() => {
        return alliances?.map((alliance) => {
            if (alliance.name === 'WHALE') {
                const apr = Number(
                    ((totalYearlyWhaleEmission * (1 - summedAllianceWeights)) /
                        (validatorData?.stakedWhale | 0)) *
                    100,
                )
                return {
                    name: 'WHALE',
                    apr: apr,
                    weight: 1 - summedAllianceWeights,
                };
            } else {
                const apr = !isNaN(alliance.totalDollarAmount)
                    ? ((totalYearlyWhaleEmission * whalePrice * alliance?.weight) /
                        alliance?.totalDollarAmount) *
                    100
                    : 0;
                return {
                    name: alliance.name,
                    apr: apr,
                    weight: alliance?.weight,
                }
            }
        })
    }, [alliances, totalYearlyWhaleEmission, whalePrice])

    return allianceAPRs || []
}

import {TabType} from "state/tabState";
import {EnhancedStakeInfo} from "hooks/useQueryStakedBalances";

export const calculateLiquidityData = (rawLiquidityTokenData, lpTokenPrice, liquidityBalances,  stakedBalances: EnhancedStakeInfo[], rewards, setLiquidityData) => {
    // Calculate data when dependencies change
    if (!lpTokenPrice || !liquidityBalances || !rewards) return

    const liquidData = rawLiquidityTokenData.map((token, index) => {
        const balance = liquidityBalances?.[index] !== undefined ? liquidityBalances?.[index] : 0
        return {
            ...token,
            dollarValue: lpTokenPrice * balance,
            value: balance,
        }
    })
    const calculateDelegationData = (tokenData: any) => {
        const allDelegations = stakedBalances.filter(
            (d) => d.tokenSymbol === tokenData.tokenSymbol,
        )
        const aggregatedDollarValue = allDelegations.reduce(
            (acc, e) => acc + (Number(e?.amount ?? 0) * Number(lpTokenPrice ?? 0)),
            0,
        )
        const aggregatedAmount = allDelegations.reduce(
            (acc, e) => acc + Number(e?.amount ?? 0),
            0,
        )

        return {
            ...tokenData,
            dollarValue: Number(aggregatedDollarValue),
            value: Number(aggregatedAmount),
        }
    }
    const calculateRewardData = () => {
        if (rewards.length === 0) return
        return rewards.filter((reward: { tabType: TabType })=>reward.tabType === TabType.liquidity).map((reward) => {
            return {
                symbol: reward.tokenSymbol,
                amount: reward.amount,
                dollarValue: (Number(reward.amount) * Number(lpTokenPrice ?? 0)),
            }
        })
    }

    const delegatedData = rawLiquidityTokenData.map((tokenData) =>
        calculateDelegationData(tokenData),
    )

    const rewardsData = calculateRewardData()

    const total = delegatedData.map((tokenData, index) => {
        const liquidTokenData = liquidData?.[index]
        const rewardsTokenData = rewardsData?.[index]
        const totalDollarValue =
            tokenData?.dollarValue +
            liquidTokenData?.dollarValue +
            (rewardsTokenData?.dollarValue || 0)
        const totalValue =
            tokenData.value + liquidTokenData.value;
        return {
            ...tokenData,
            dollarValue: totalDollarValue,
            value: totalValue,
        };
    });

    const delegationData = {
        delegated: delegatedData,
        liquid: liquidData,
        rewards: rewardsData,
        total,
    }

    setLiquidityData(delegationData);
}

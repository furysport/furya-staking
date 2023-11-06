import {EnhancedStakeInfo} from "hooks/useQueryStakedBalances";
import {RewardInfo} from "hooks/useQueryRewards";
import {TabType} from "state/tabState";

export const calculateEcosystemData = (rawEcosystemTokenData, priceList, ecosystemBalances, stakedBalances: EnhancedStakeInfo[], rewards: RewardInfo[],  setEcosystemData) => {
    // Calculate data when dependencies change
    if (!priceList || !ecosystemBalances || !stakedBalances || !rewards) return

    const liquidData = rawEcosystemTokenData.map((token, index) => {
        const balance = ecosystemBalances?.[index] !== undefined ? ecosystemBalances?.[index] : 0
        return {
            ...token,
            dollarValue: token.symbol === 'mUSDC' ? balance :
                priceList && priceList[token.name]
                    ? priceList[token.name] * balance
                    : 0,
            value: balance,
        }
    })

    const calculateDelegationData = (tokenData: any) => {
        const allDelegations = stakedBalances.filter(
            (balance) =>  balance?.tokenSymbol === tokenData?.tokenSymbol,
        )
        const aggregatedAmount = allDelegations.reduce(
            (acc, e) => acc + Number(e?.amount ?? 0),
            0,
        )

        return {
            ...tokenData,
            dollarValue: Number(aggregatedAmount) * (tokenData.tokenSymbol === 'mUSDC' ? 1 : Number(priceList[tokenData.name] ?? 0)),
            value: Number(aggregatedAmount),
        }
    }

    const calculateRewardData = () => {

        return rewards?.filter(reward=> reward.tabType === TabType.ecosystem).map((reward) => {
            return {
                symbol: reward.tokenSymbol,
                amount: reward.amount || 0,
                dollarValue: reward.tokenSymbol === 'mUSDC' ? 1 : (Number(reward.amount) * Number(priceList[reward.name] ?? 0)),
                denom: reward.denom,
                stakedDenom: reward.stakedDenom,
            }
        })
    }

    const delegatedData = rawEcosystemTokenData.map((tokenData) =>
        calculateDelegationData(tokenData),
    )

    const rewardsData = calculateRewardData()

    const total = delegatedData.map((tokenData, index) => {
        const liquidTokenData = liquidData[index];
        const rewardsTokenData = rewardsData[index]
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

    setEcosystemData(delegationData)
}

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
            dollarValue: token.symbol === 'mUSDC' ? 1 :
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
        const aggregatedDollarValue = allDelegations.reduce(
            (acc, e) => acc + e.tokenSymbol === 'mUSDC' ? 1 : (Number(e?.amount ?? 0) * Number(priceList[e.name] ?? 0)),
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

        return rewards?.filter(reward=> reward.tabType === TabType.ecosystem).map((reward) => {
            return {
                symbol: reward.tokenSymbol,
                amount: reward.amount,
                dollarValue: reward.tokenSymbol === 'mUSDC' ? 1 : (Number(reward.amount) * Number(priceList[reward.name] ?? 0)),
            }
        })
    }

    const delegatedData = rawEcosystemTokenData.map((tokenData) =>
        calculateDelegationData(tokenData),
    )

    const rewardsData = calculateRewardData()

    const total = delegatedData.map((tokenData, index) => {
        const liquidTokenData = liquidData[index];
        const rewardsTokenData = rewardsData[index];
        const totalDollarValue =
            tokenData?.dollarValue +
            liquidTokenData?.dollarValue +
            (rewardsTokenData?.dollarValue ?? 0);
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

    setEcosystemData(delegationData);
}

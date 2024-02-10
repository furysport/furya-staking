import { RewardInfo } from 'hooks/useQueryRewards';
import { EnhancedStakeInfo } from 'hooks/useQueryStakedBalances';
import { TabType } from 'state/tabState';

export const calculateLiquidityData = (
  rawLiquidityTokenData, priceList, lpTokenPrices, liquidityBalances, stakedBalances: EnhancedStakeInfo[], rewards, setLiquidityData,
) => {
  // Calculate data when dependencies change
  if (!lpTokenPrices || !liquidityBalances || !rewards || !stakedBalances) {
    return
  }

  const liquidData = rawLiquidityTokenData.map((token, index) => {
    const balance = liquidityBalances?.[index] ? liquidityBalances?.[index] : 0
    return {
      ...token,
      dollarValue: (lpTokenPrices?.[token.name] || 0) * balance,
      value: balance,
    }
  })
  const calculateDelegationData = (tokenData: any) => {
    const allDelegations = stakedBalances.filter((d) => d.tokenSymbol === tokenData.tokenSymbol)
    const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + (Number(e?.amount ?? 0) * Number(lpTokenPrices?.[e.name] ?? 0)),
      0)
    const aggregatedAmount = allDelegations.reduce((acc, e) => acc + Number(e?.amount ?? 0),
      0)

    return {
      ...tokenData,
      dollarValue: Number(aggregatedDollarValue),
      value: Number(aggregatedAmount),
    }
  }
  const calculateRewardData = () => {
    if (rewards?.length === 0) {
      return null
    }
    return rewards.filter((reward: RewardInfo) => reward.tabType === TabType.liquidity && reward.amount > 0).map((reward) => ({
      symbol: reward.tokenSymbol,
      amount: reward.amount,
      dollarValue: reward.tokenSymbol.includes('-LP') ? lpTokenPrices?.[reward.tokenSymbol] || 0 : (Number(reward.amount) * Number(priceList?.[reward.name] || 0)),
      denom: reward.denom,
      stakedDenom: reward.stakedDenom,
    }))
  }

  const delegatedData = rawLiquidityTokenData.map((tokenData) => calculateDelegationData(tokenData))

  const rewardsData = calculateRewardData()

  const total = delegatedData.map((tokenData, index) => {
    const liquidTokenData = liquidData?.[index]
    const rewardsTokenData = rewardsData?.[index]
    const totalDollarValue =
      (tokenData?.dollarValue ?? 0) +
      (liquidTokenData?.dollarValue ?? 0) +
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

import { DelegationData, Reward } from 'components/Pages/Dashboard';
import whiteListedAllianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'

export const calculateAllianceData = (
  rawAllianceTokenData, priceList, allianceBalances, delegations, undelegations, setAllianceData,
) => {
  // Calculate data when dependencies change
  if (!priceList || !allianceBalances || !delegations) {
    return
  }

  const liquidData = rawAllianceTokenData?.map((token, index) => {
    const balance = allianceBalances?.[index] ? allianceBalances?.[index] : 0
    return {
      ...token,
      dollarValue:
        priceList && priceList[token.name]
          ? priceList[token.name] * balance
          : 0,
      value: balance,
    }
  })

  const calculateDelegationData = (tokenData: any) => {
    const allDelegations = delegations.filter((d) => d.token.symbol === tokenData.tokenSymbol)
    const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + Number(e?.token.dollarValue ?? 0),
      0)
    const aggregatedAmount = allDelegations.reduce((acc, e) => acc + Number(e?.token?.amount ?? 0),
      0)

    return {
      ...tokenData,
      dollarValue: Number(aggregatedDollarValue),
      value: Number(aggregatedAmount),
    }
  }
  const calculateUndelegationData = (tokenData: any) => {
    const allUndelegations = undelegations.filter((d) => d.symbol === tokenData.tokenSymbol)
    const aggregatedDollarValue = allUndelegations.reduce((acc, e) => acc + Number(e?.dollarValue ?? 0),
      0)
    const aggregatedAmount = allUndelegations.reduce((acc, e) => acc + Number(e?.amount ?? 0),
      0)

    return {
      ...tokenData,
      dollarValue: Number(aggregatedDollarValue),
      value: Number(aggregatedAmount),
    }
  };
  const calculateRewardData = () => {
    const allRewards = delegations?.map((d) => d.rewards);
    const concatenatedRewards: Reward[] = allRewards.reduce((acc: Reward[], currList: Reward[]) => acc.concat(currList),
      [])

    return whiteListedAllianceTokens?.map((t) => {
      const sameTokenRewards = concatenatedRewards.filter((r) => r.denom === t.denom)

      const amount = sameTokenRewards?.reduce((acc, e) => acc + (Number(e?.amount) ?? 0),
        0)
      const dollarValue = sameTokenRewards?.reduce((acc, e) => acc + (Number(e?.dollarValue) ?? 0),
        0)
      return {
        symbol: t.symbol,
        amount,
        dollarValue,
      }
    })
  }

  const delegatedData = rawAllianceTokenData.map((tokenData) => calculateDelegationData(tokenData))

  const undelegatedData = rawAllianceTokenData.map((tokenData) => calculateUndelegationData(tokenData))

  const rewardsData = calculateRewardData()

  const total = delegatedData.map((tokenData, index) => {
    const undelegatedTokenData = undelegatedData[index];
    const liquidTokenData = liquidData[index];
    const totalDollarValue =
      (tokenData?.dollarValue ?? 0) +
      (undelegatedTokenData?.dollarValue ?? 0) +
      (liquidTokenData?.dollarValue ?? 0)
    const totalValue =
      tokenData.value + undelegatedTokenData.value + (liquidTokenData?.value ?? 0)
    return {
      ...tokenData,
      dollarValue: totalDollarValue,
      value: totalValue,
    }
  })

  const delegationData: DelegationData = {
    delegated: delegatedData,
    undelegated: undelegatedData,
    liquid: liquidData,
    rewards: rewardsData,
    total,
  }
  setAllianceData(delegationData)
}

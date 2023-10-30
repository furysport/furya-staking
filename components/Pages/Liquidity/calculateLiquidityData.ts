import {Reward} from "components/Pages/Dashboard";
import whiteListedLiquidityTokens from 'public/mainnet/white_listed_liquidity_token_info.json'

export const calculateLiquidityData = (rawLiquidityTokenData, lpTokenPrice, liquidityBalances,delegations, setLiquidityData) => {
    // Calculate data when dependencies change
    if (!lpTokenPrice|| !liquidityBalances) return

    const liquidData = rawLiquidityTokenData.map((token, index) => {
        const balance = liquidityBalances?.[index] !== undefined ? liquidityBalances?.[index] : 0
        return {
            ...token,
            dollarValue: lpTokenPrice * balance,
            value: balance,
        }
    })

    const calculateDelegationData = (tokenData: any) => {
        const allDelegations = delegations.filter(
            (d) => d.token.symbol === tokenData.tokenSymbol,
        )
        const aggregatedDollarValue = allDelegations.reduce(
            (acc, e) => acc + Number(e?.token.dollarValue ?? 0),
            0,
        )
        const aggregatedAmount = allDelegations.reduce(
            (acc, e) => acc + Number(e?.token?.amount ?? 0),
            0,
        )

        return {
            ...tokenData,
            dollarValue: Number(aggregatedDollarValue),
            value: Number(aggregatedAmount),
        }
    }

    const calculateRewardData = () => {
        const allRewards = delegations.map((d) => d.rewards);
        const concatenatedRewards: Reward[] = allRewards.reduce(
            (acc: Reward[], currList: Reward[]) => {
                return acc.concat(currList);
            },
            [],
        )

        return whiteListedLiquidityTokens.map((t) => {
            const sameTokenRewards = concatenatedRewards.filter(
                (r) => r.denom === t.denom,
            )

            const amount = sameTokenRewards?.reduce(
                (acc, e) => acc + (Number(e?.amount) ?? 0),
                0,
            )
            const dollarValue = sameTokenRewards?.reduce(
                (acc, e) => acc + (Number(e?.dollarValue) ?? 0),
                0,
            )
            return {
                symbol: t.symbol,
                amount: amount,
                dollarValue: dollarValue,
            }
        })
    }

    const delegatedData = rawLiquidityTokenData.map((tokenData) =>
        calculateDelegationData(tokenData),
    )

    const rewardsData = calculateRewardData()

    const total = delegatedData.map((tokenData, index) => {
        const liquidTokenData = liquidData[index];
        const rewardsTokenData = rewardsData[index];
        const totalDollarValue =
            tokenData?.dollarValue +
            liquidTokenData?.dollarValue +
            rewardsTokenData?.dollarValue;
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

import {Coins, LCDClient} from "@terra-money/feather.js"
import useClient from "hooks/useClient"
import tokens from "public/mainnet/white_listed_token_info.json"
import usePrice from "./usePrice"
import {num} from "libs/num";
import {useQuery} from "react-query";

const getDelegation = async (client: LCDClient | null, priceList: any, delegatorAddress: string): Promise<any> => {

    if (!client) return Promise.resolve([])

    const getRewards = (delegations: any) => {

        return Promise.all(delegations?.map(async (item: any) => {
            const {delegator_address, validator_address, denom} = item.delegation
            return await client?.alliance
                .getReqFromAddress(delegatorAddress)
                .get<{ rewards?: Coins }>(
                    `/terra/alliances/rewards/${delegator_address}/${validator_address}/${denom}`,
                    {}
                ).then(({rewards}) => {
                    //TODO check if this continues to work with different rewards
                    const reward = rewards[0]
                    return {
                        ...item,
                        reward,
                    }
                })
                .catch((e) => {
                    return {
                        ...item,
                        rewards: null
                    }
                })
        }))
    }
    const allianceDelegation = await client?.alliance.alliancesDelegation(delegatorAddress)


    return getRewards(allianceDelegation?.delegations)
        .then((data) => {
            return data?.map((item) => {
                const delegatedToken = tokens.find((token) => token.denom === item.balance?.denom)
                const rewardToken = tokens.find((token) => token.denom === item.reward?.denom)
                //delegation amount
                const amount = delegatedToken ? num(item.balance?.amount).div(10 ** delegatedToken.decimals).toNumber() : 0
                const dollarValue = delegatedToken ? num(amount).times(priceList[delegatedToken.name]).dp(2).toNumber() : 0
                //rewards amount
                const rewardsAmount = rewardToken ? num(item.reward?.amount).div(10 ** rewardToken.decimals).dp(rewardToken.decimals).toNumber() : 0
                const rewardsDollarValue = rewardToken ? num(rewardsAmount).times(priceList[rewardToken.name]).dp(2).toNumber() : 0

                return {
                    ...item,
                    reward: {
                        amount: rewardsAmount,
                        dollarValue: rewardsDollarValue,
                        denom: item?.reward?.denom
                    },
                    token: {
                        ...delegatedToken,
                        amount,
                        dollarValue
                    }
                }
            })
        })
        .then((data) => {
            // sum to total delegation
            const totalDelegation = data.reduce((acc, item) => {
                const { dollarValue } = item.token
                return {
                    dollarValue: acc.dollarValue + dollarValue
                }

            }, { dollarValue: 0 })
            const totalRewards = data.reduce((acc, item) => {
                const { dollarValue } = item.reward
                return {
                    dollarValue: acc.dollarValue + dollarValue
                }
            }, { dollarValue: 0 })
            return {
                delegations: data,
                totalDelegation: totalDelegation?.dollarValue?.toFixed(2),
                totalRewards: totalRewards?.dollarValue?.toFixed(2)
            }

        })

}


const useDelegations = ({address}) => {
    const client = useClient()
    const [priceList] = usePrice() || []
    return useQuery({
        queryKey: ['delegations', priceList, address],
        queryFn: () => getDelegation(client, priceList,address),
        enabled: !!client && !!address && !!priceList,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 5000
    })

}

export default useDelegations;
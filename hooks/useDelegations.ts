import { LCDClient, Coins } from "@terra-money/feather.js"
import useClient from "hooks/useClient"
import tokens from "public/mainnet/white_listed_token_info.json"
import usePrice from "./usePrice"
import {num} from "libs/num";
import {useQuery} from "react-query";

const getDelegation = async (client: LCDClient | null, priceList: any, delegatorAddress: string): Promise<any> => {

    if (!client) return Promise.resolve([])

    const mockResponse = {
        delegations: [
            {
                delegation: {
                    delegator_address: "migaloo1luw6vqtnxx96s094t5hchu6xx9t3fw9g4cpr53",
                    validator_address: "migaloovaloper1rqvctgdpafvc0k9fx4ng8ckt94x723zmp3g0jv",
                    denom: "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708"
                },
                balance: {
                    denom: "ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708",
                    amount: "10000000",
                }
            },
            {
                delegation: {
                    delegator_address: "migaloo1luw6vqtnxx96s094t5hchu6xx9t3fw9g4cpr53",
                    validator_address: "migaloovaloper1fc4kjfau480nr503yl0r8ml7vvn07d2rvn0750",
                    denom: "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A"
                },
                balance: {
                    denom: "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A",
                    amount: "20000000",

                }
            }
        ]
    }

    const mockRewards = (denom: string) => ({
        rewards: {
            denom: denom,
            amount: Math.random() * 3000000
        }
    })

    const getRewards = (delegations: any) => {

        return Promise.all(delegations?.map((item: any) => {
            const { delegator_address, validator_address, denom } = item.delegation

            // return client?.alliance.delegatorRewards(delegator_address, validator_address, denom)
            return client?.alliance.delegatorRewards(delegator_address, validator_address, denom)
                .then(({ rewards }) => {
                    return {
                        ...item,
                        rewards
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

    return getRewards(allianceDelegation.delegations)
        .then((data) => {
            console.log()
            return data?.map((item) => {
                const token = tokens.find((token) => token.denom === item.balance?.denom)
                //delegation amount
                const amount = token ? num(item.balance?.amount).div(10 ** token.decimals).toNumber() : 0

                const dollarValue = token ? num(amount).times(priceList[token.name]).dp(2).toNumber() : 0

                //rewards amount
                const rewardsAmount = token ? num(item.rewards?.amount).div(10 ** token.decimals).dp(token.decimals).toNumber() : 0
                const rewardsDollarValue = token ? num(rewardsAmount).times(priceList[token.name]).dp(2).toNumber() : 0
                return {
                    ...item,
                    rewards: {
                        amount: rewardsAmount,
                        dollarValue: rewardsDollarValue
                    },
                    token: {
                        ...token,
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
                const { dollarValue } = item.rewards
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
    const [priceList, timestamp] = usePrice() || []
    return useQuery({
        queryKey: ['delegations', priceList, address],
        queryFn: () => getDelegation(client, priceList,address),
        enabled: !!client && !!address,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

}

export default useDelegations;
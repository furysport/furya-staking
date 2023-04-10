import { LCDClient, Coins } from "@terra-money/feather.js"
import useClient from "hooks/useClient"
import tokens from "public/mainnet/white_listed_token_info.json"
import usePrice from "./usePrice"
import {num} from "libs/num";
import {useQuery} from "react-query";
import useValidators from "hooks/useValidators";

const getUndelegations = async (client: LCDClient | null, priceList: any, delegatorAddress: string,validatorAddress: string): Promise<any> => {


    //const undelegations = await client.staking.validators("migaloo-1")//.then(data=>client.staking.unbondingDelegations(null,data[0][0].operator_address))


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




    // const allianceDelegation = await client?.alliance.alliancesDelegation(delegatorAddress)
    //
    // return getRewards(allianceDelegation?.delegations)
    //     .then((data) => {
    //         return data?.map((item) => {
    //             const token = tokens.find((token) => token.denom === item.balance?.denom)
    //             //delegation amount
    //             const amount = token ? num(item.balance?.amount).div(10 ** token.decimals).toNumber() : 0
    //             const dollarValue = token ? num(amount).times(priceList[token.name]).dp(2).toNumber() : 0
    //             //rewards amount
    //             const rewardsAmount = token ? num(item.rewards?.amount).div(10 ** token.decimals).dp(token.decimals).toNumber() : 0
    //             const rewardsDollarValue = token ? num(rewardsAmount).times(priceList[token.name]).dp(2).toNumber() : 0
    //
    //             return {
    //                 ...item,
    //                 rewards: {
    //                     amount: rewardsAmount,
    //                     dollarValue: rewardsDollarValue
    //                 },
    //                 token: {
    //                     ...token,
    //                     amount,
    //                     dollarValue
    //                 }
    //             }
    //         })
    //     })
    //     .then((data) => {
    //         // sum to total delegation
    //         const totalDelegation = data.reduce((acc, item) => {
    //             const { dollarValue } = item.token
    //             return {
    //                 dollarValue: acc.dollarValue + dollarValue
    //             }
    //
    //         }, { dollarValue: 0 })
    //         const totalRewards = data.reduce((acc, item) => {
    //             const { dollarValue } = item.rewards
    //             return {
    //                 dollarValue: acc.dollarValue + dollarValue
    //             }
    //         }, { dollarValue: 0 })
    //         return {
    //             delegations: data,
    //             totalDelegation: totalDelegation?.dollarValue?.toFixed(2),
    //             totalRewards: totalRewards?.dollarValue?.toFixed(2)
    //         }
    //
    //     })

}


const useUndelegations = ({address}) => {
    const client = useClient()
    const { data: { validators = [] } = {} } = useValidators({address})
    const [priceList, timestamp] = usePrice() || []
    return useQuery({
        queryKey: ['undelegations', priceList, address],
        queryFn: () => getUndelegations(client,priceList,address, validators[0].operator_address),
        enabled: !!client && !!address && !!priceList && !!validators,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

}

export default useUndelegations;
import {useQuery} from "react-query";
import {useRecoilValue} from "recoil";
import {walletState} from "state/walletState";
import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"
import tokens from "public/mainnet/tokens.json";
import {convertMicroDenomToDenom} from "util/conversion";

interface Asset {
    native: string
    cw20: string
}

interface RawRewardInfo {
    reward_asset: Asset
    rewards: string
    staked_asset: Asset
}

export interface RewardInfo {
    tokenSymbol: string
    name: string
    denom: string
    amount: number
}
const getRewards = async (contractAddress: string, address: string, client: Wallet): Promise<RewardInfo[]> => {
    const msg = {
        all_pending_rewards: {
            address: address
        }
    }
    const rawRewards : RawRewardInfo[] = await client.queryContractSmart(contractAddress, msg)
    return rawRewards.map((info) => {
        const token = tokens.find((token) => token.denom === (info?.reward_asset?.native ?? info?.reward_asset?.cw20))
        return {
            tokenSymbol: token.symbol,
            name: token.name,
            denom: token.denom,
            amount: convertMicroDenomToDenom(info.rewards, 6),
        }
    })
}
export const useQueryRewards = () => {
    const {client, address} = useRecoilValue(walletState)
    const {data, isLoading} = useQuery({
        queryKey: ['rewards', file.alliance_contract, address],
        queryFn: () => getRewards(file.alliance_contract, address, client),
        refetchInterval: 60000,
        enabled: Boolean(file.alliance_contract) && Boolean(client) && Boolean(address),
    })
    return {data, isLoading}
}

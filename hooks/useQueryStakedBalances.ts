import {useQuery} from "react-query";
import {useRecoilValue} from "recoil";
import {walletState} from "state/walletState";
import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"
import tokens from 'public/mainnet/tokens.json'
import {convertMicroDenomToDenom} from "util/conversion";

interface Asset {
    cw20?: string; // Use cw20 as an optional property
    native?: string; // Use native as an optional property
}


export interface EnhancedStakeInfo {
    denom: string
    tokenSymbol: string
    name: string
    amount: number
    isNative: boolean
}
const getStakedBalances = async (contractAddress: string, address: string, client: Wallet): Promise<EnhancedStakeInfo[]> => {
    const msg = {
        all_staked_balances: {
            address: address
        }
    }
    const stakedInfos = await client.queryContractSmart(contractAddress, msg)

    console.log("stakedInfos")
    console.log(stakedInfos)

    return stakedInfos.map((info) => {
        const token = tokens.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
       try {
            return {
                denom: token.denom,
                tokenSymbol: token.symbol,
                name: token.name,
                amount: convertMicroDenomToDenom(info?.balance, 6),
                isNative: Boolean(info?.asset?.native)
            }
        }catch (e) {
            console.log("ERROR")
           tokens.find((token) => {
                console.log(token.symbol)
                console.log(token.denom)
                console.log(info?.asset?.native ?? info?.asset?.cw20)
               console.log(token.denom === info?.asset?.native ?? info?.asset?.cw20)
               return token.denom === info?.asset?.native ?? info?.asset?.cw20
           })
       }
    })
}
export const useQueryStakedBalances = () => {
    const {client, address} = useRecoilValue(walletState)
    const {data, isLoading} = useQuery({
        queryKey: ['balances', file.alliance_contract, address],
        queryFn: () => getStakedBalances(file.alliance_contract, address, client),
        refetchInterval: 60000,
        refetchIntervalInBackground: true,
        enabled: Boolean(file.alliance_contract) && Boolean(client),
    })
    return {data, isLoading}
}

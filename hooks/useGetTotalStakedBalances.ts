import useClient from "hooks/useClient";
import {useQuery} from "react-query";
import file from "public/mainnet/contract_addresses.json"
import {useRecoilValue} from "recoil";
import {walletState} from "state/walletState";
import {Wallet} from "util/wallet-adapters/index";

const fetchTotalStakedBalances = async (client: Wallet, address) => {
    const msg ={reward_distribution: { }}
    const res = await client.queryContractSmart(file.alliance_contract, msg)
    return res
}
export const useGetTotalStakedBalances = () => {
    const client = useClient()
    const {client: wc, address } = useRecoilValue(walletState)
    const {data, isLoading} = useQuery({
        queryKey: 'totalStakeBalances',
        queryFn: () => fetchTotalStakedBalances(wc, address),
        enabled: !!client,
    })

}

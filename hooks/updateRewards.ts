import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"

export const updateRewards = async (
    client: Wallet,
    address: string,
) => {
    const msg = {
        update_rewards: {}
    }
    return await client.execute(address, file.alliance_contract, [msg], null)
};

import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"

export const claimRewards = async (
    client: Wallet,
    address: string,
    denom: string,
    isNative: boolean,
) => {
    const nativeMsg = {
        claim_rewards: {
            native: denom
        }
    }
    const nonNativeMsg = {
        claim_rewards: {
            cw20: denom
        }
    }

    return await client.execute(address, file.alliance_contract,isNative ? nativeMsg: nonNativeMsg, null)
};

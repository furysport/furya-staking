import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"
import {isNativeToken} from "util/isNative";

export const claimRewards = async (
    client: Wallet,
    address: string,
    rewardDenoms: string[],
) => {
    const denom = rewardDenoms[0]
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

    return await client.execute(address, file.alliance_contract,isNativeToken(denom) ? nativeMsg: nonNativeMsg, null)
};

import {Wallet} from "util/wallet-adapters/index"
import file from "public/mainnet/contract_addresses.json"
import {isNativeToken} from "util/isNative";
import {TerraStationWallet} from "util/wallet-adapters/terraStationWallet";

export const claimRewards = async (
    client: TerraStationWallet,
    address: string,
    stakedDenoms: string[],
) => {
    const msgs = stakedDenoms.map((denom) => isNativeToken(denom) ? {
        claim_rewards: {
            native: denom
        }
    } : {
        claim_rewards: {
            cw20: denom
        }
    })
    return await client.execute(address, file.alliance_contract, msgs, null)
};

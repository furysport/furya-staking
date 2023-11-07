import {Wallet} from "util/wallet-adapters/index";
import file from "public/mainnet/contract_addresses.json"
import {ActionType} from "components/Pages/Dashboard";

export const undelegate = async (
    client: Wallet,
    address: string,
    amount: string,
    denom: string,
    isNative: boolean,
) => {
    const nativeMsg = {
        unstake: {
            info: {
                native: denom
            },
            amount: amount
        }
    }

    const nonNativeMsg = {
        unstake: {
            info: {
                cw20: denom
            },
            amount: amount
        }
    }
    const result = await client.execute(address, file.alliance_contract, [isNative ? nativeMsg : nonNativeMsg], null)
    const actionType = ActionType.undelegate
    return {result, actionType}
}

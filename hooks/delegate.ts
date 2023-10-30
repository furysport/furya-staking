import file from "public/mainnet/contract_addresses.json"
import {coin} from "@cosmjs/amino";
import {isNativeToken} from "util/isNative";
import {MsgExecuteContract} from "@terra-money/feather.js";
import {toBase64} from "util/toBase64";
export const delegate = async (
    client: any,
    address: string,
    amount: string,
    denom: string,
) => {
    if (isNativeToken(denom)) {
        const msg = {
            stake: {}
        }
        return await client.execute(address, file.alliance_contract, msg, [coin(amount, denom)])

    } else {
        const stakeMessage = {
            stake: {}
        }

        const msgs = [
            new MsgExecuteContract(
                address,
                denom,
                {
                    "increase_allowance": {
                        "amount": amount,
                        "spender": file.alliance_contract
                    }
                }, []
            ),
            new MsgExecuteContract(
                address,
                denom,
                {
                    "send": {
                        "amount": amount,
                        "contract": file.alliance_contract,
                        "msg": toBase64(stakeMessage)
                    }
                },
                [],
            )]

        return await client.client.post({chainID: 'migaloo-1', msgs: msgs});
    }

}

import {Wallet} from "util/wallet-adapters/index";
import file from "public/mainnet/contract_addresses.json"
import {Coin} from "@terra-money/feather.js";
import {coin} from "@cosmjs/amino";

export const delegate = async (
    client: Wallet,
    address: string,
    amount: string,
    denom: string,
) => {
    const msg = {
        stake: {}
    }
    return await client.execute(address, file.alliance_contract, msg, [coin(amount, denom)])
}

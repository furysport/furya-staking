import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceRedelegate} from '@terra-money/feather.js';
export const redelegate = async (
    wallet: TerraStationWallet,
    destBlockchain: string,
    validatorSrcAddress: string,
    validatorDstAddress: string, address: string,
    amount: number,
    validators: any,
    allianceDenom: string
) => {
    console.log("REDELEGATE")
    console.log(validators.filter(v=>v.operator_address === validatorSrcAddress))
    console.log(validators.filter(v=>v.operator_address === validatorDstAddress))
    const handleMsg = new MsgAllianceRedelegate(
        address,
        validatorDstAddress,
        validatorSrcAddress,
        new Coin(allianceDenom, amount)
    );
    return await wallet.client.post({ chainID: destBlockchain, msgs: [handleMsg] });

};
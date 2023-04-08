import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceRedelegate} from '@terra-money/feather.js';
export const redelegate = async (
    wallet: TerraStationWallet,
    destBlockchain: string,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: number,
    allianceDenom: string
) => {
    const handleMsg = new MsgAllianceRedelegate(
        wallet.client.addresses[destBlockchain],
        validatorSrcAddress,
        validatorDstAddress,
        new Coin(allianceDenom, amount)
    );
    try {
        const result = await wallet.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
        console.log(result);
        return result
    } catch (error) {
        console.error("Error occurred while posting transaction:", error);
        return
    }

};
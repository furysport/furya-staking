import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceDelegate } from '@terra-money/feather.js';

export const delegate = async (
    wallet: TerraStationWallet,
    destBlockchain: string,
    valAddress: string,
    amount: number,
    allianceDenom: string
) => {
    const handleMsg = new MsgAllianceDelegate(
        wallet.client.addresses[destBlockchain],
        valAddress,
        new Coin(allianceDenom, amount)
    );

    return await wallet.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
};
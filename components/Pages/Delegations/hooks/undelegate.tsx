import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceUndelegate } from '@terra-money/feather.js';

export const undelegate = async (
    wallet: TerraStationWallet,
    destBlockchain: string,
    valAddress: string,
    amount: number,
    allianceDenom: string
) => {
    const handleMsg = new MsgAllianceUndelegate(
        wallet.client.addresses[destBlockchain],
        valAddress,
        new Coin(allianceDenom, amount)
    );

    return wallet.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
};
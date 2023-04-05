import { TerraStationWallet } from '../../../../util/wallet-adapters/terraStationWallet';
import { Coin, LCDClient, MsgAllianceDelegate, MsgAllianceRedelegate, MsgAllianceUndelegate } from '@terra-money/feather.js';

export const useAllianceDelegate = async (
    client: TerraStationWallet,
    destBlockchain: string,
    valAddress: string,
    amount: number,
    allianceDenom: string
) => {
    const handleMsg = new MsgAllianceDelegate(
        client.client.addresses[destBlockchain],
        valAddress,
        new Coin(allianceDenom, amount)
    );

    return client.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
};
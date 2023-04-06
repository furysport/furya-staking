import { TerraStationWallet } from '../../../../util/wallet-adapters/terraStationWallet';
import { Coin, LCDClient, MsgAllianceDelegate, MsgAllianceRedelegate, MsgAllianceUndelegate } from '@terra-money/feather.js';
export const useAllianceReDelegate = async (
    client: TerraStationWallet,
    destBlockchain: string,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: number,
    allianceDenom: string
) => {
    const handleMsg = new MsgAllianceRedelegate(
        client.client.addresses[destBlockchain],
        validatorSrcAddress,
        validatorDstAddress,
        new Coin(allianceDenom, amount)
    );

    return client.client.post({ chainID: destBlockchain, msgs: [handleMsg] });
};
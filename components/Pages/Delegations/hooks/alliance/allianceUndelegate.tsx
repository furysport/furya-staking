import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin } from '@terra-money/feather.js';
import { MsgUndelegate } from '@terra-money/feather.js/dist/core/alliance/msgs';

export const allianceUndelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  valAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  const handleMsg = new MsgUndelegate(
    address,
    valAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};

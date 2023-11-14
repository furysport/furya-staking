import { Coin, MsgDelegate } from '@terra-money/feather.js';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';

export const nativeDelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  valAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  const handleMsg = new MsgDelegate(
    address,
    valAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};

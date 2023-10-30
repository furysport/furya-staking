import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgBeginRedelegate } from '@terra-money/feather.js';
export const nativeRedelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  // wrong sig valDest => valSrc valSrc => valDest
  const handleMsg = new MsgBeginRedelegate(
    address,
    validatorSrcAddress,
    validatorDstAddress,
    new Coin(allianceDenom, amount),
  );

  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};

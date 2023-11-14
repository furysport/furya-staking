import { Coin, MsgUndelegate } from '@terra-money/feather.js';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';

export const nativeUndelegate = async (
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

  /*
   * Const feeEstimation = await estimateFee(wallet,address,[handleMsg])
   * const amounts = feeEstimation.amount
   * const gasLimit = feeEstimation.gas_limit
   * return await wallet.client.post({ chainID: destBlockchain, msgs: [handleMsg], fee:new Fee(gasLimit, amounts)});
   */
  return await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  });
};

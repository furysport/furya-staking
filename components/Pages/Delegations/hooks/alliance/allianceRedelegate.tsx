import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceRedelegate } from '@terra-money/feather.js';
export const allianceRedelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: number,
  validators: any,
  allianceDenom: string,
) => {
  const handleMsg = new MsgAllianceRedelegate(
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

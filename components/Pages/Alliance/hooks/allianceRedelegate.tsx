import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { Coin, MsgAllianceRedelegate } from '@terra-money/feather.js';
import {ActionType} from "components/Pages/Dashboard";
export const allianceRedelegate = async (
  wallet: TerraStationWallet,
  destBlockchain: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: number,
  allianceDenom: string,
) => {
  const handleMsg = new MsgAllianceRedelegate(
    address,
    validatorSrcAddress,
    validatorDstAddress,
    new Coin(allianceDenom, amount),
  );
  const result = await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  })
  const actionType = ActionType.redelegate
  return { result, actionType }
}

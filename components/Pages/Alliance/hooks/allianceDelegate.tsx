import { Coin } from '@terra-money/feather.js';
import { MsgDelegate } from '@terra-money/feather.js/dist/core/alliance/msgs';
import { ActionType } from 'components/Pages/Dashboard';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';

export const allianceDelegate = async (
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
  const result = await wallet.client.post({
    chainID: destBlockchain,
    msgs: [handleMsg],
  })
  const actionType = ActionType.delegate
  return { result,
    actionType }
}

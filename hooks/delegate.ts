import { coin } from '@cosmjs/amino';
import { MsgExecuteContract } from '@terra-money/feather.js';
import { ActionType } from 'components/Pages/Dashboard';
import file from 'public/mainnet/contract_addresses.json'
import { isNativeToken } from 'util/isNative';
import { toBase64 } from 'util/toBase64';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
export const delegate = async (
  client: TerraStationWallet,
  address: string,
  amount: string,
  denom: string,
) => {
  if (isNativeToken(denom)) {
    const msg = {
      stake: {},
    }
    const result = await client.execute(
      address, file.alliance_contract, [msg], [coin(amount, denom)],
    )
    const actionType = ActionType.delegate
    return { result,
      actionType }
  } else {
    const stakeMessage = {
      stake: {},
    }

    const msgs = [
      new MsgExecuteContract(
        address,
        denom,
        {
          send: {
            amount,
            contract: file.alliance_contract,
            msg: toBase64(stakeMessage),
          },
        },
        [],
      )]
    const result = await client.client.post({ chainID: 'migaloo-1',
      msgs })
    const actionType = ActionType.delegate
    return { result,
      actionType }
  }
}

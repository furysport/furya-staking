import { ActionType } from 'components/Pages/Dashboard';
import file from 'public/mainnet/contract_addresses.json'
import { Wallet } from 'util/wallet-adapters/index'

export const updateRewards = async (client: Wallet,
  address: string) => {
  const msg = {
    update_rewards: {},
  }
  const result = await client.execute(
    address, file.alliance_contract, [msg], null,
  )
  const actionType = ActionType.updateRewards
  return { result,
    actionType }
}

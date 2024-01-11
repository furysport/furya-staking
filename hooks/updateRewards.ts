import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'
import file from 'public/mainnet/contract_addresses.json'

export const updateRewards = async (client: SigningCosmWasmClient,
  address: string) => {
  const msg = {
    update_rewards: {},
  }
  return await client.execute(
    address, file.alliance_contract, msg, 'auto',
  )
}

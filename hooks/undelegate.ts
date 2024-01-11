import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient'
import file from 'public/mainnet/contract_addresses.json'

export const undelegate = async (
  client: SigningCosmWasmClient,
  address: string,
  amount: string,
  denom: string,
  isNative: boolean,
) => {
  const nativeMsg = {
    unstake: {
      info: {
        native: denom,
      },
      amount,
    },
  }

  const nonNativeMsg = {
    unstake: {
      info: {
        cw20: denom,
      },
      amount,
    },
  }

  return await client.execute(
    address, file.alliance_contract, isNative ? nativeMsg : nonNativeMsg, null,
  )
}

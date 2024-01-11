import { coin } from '@cosmjs/amino';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import file from 'public/mainnet/contract_addresses.json'
import { createExecuteMessage } from 'util/createExecutionMessage';
import { isNativeToken } from 'util/isNative';
import { toBase64 } from 'util/toBase64';
export const delegate = async (
  client: SigningCosmWasmClient,
  address: string,
  amount: string,
  denom: string,
) => {
  const stakeMessage = {
    stake: {},
  }

  if (isNativeToken(denom)) {
    const msg = createExecuteMessage({ senderAddress: address,
      contractAddress: file.alliance_contract,
      message: stakeMessage,
      funds: [coin(amount, denom)] })
    return await client.signAndBroadcast(
      address, [msg], 'auto', null,
    )
  } else {
    const msg =
        {
          send: {
            amount,
            contract: file.alliance_contract,
            msg: toBase64(stakeMessage),
          },
        }

    return await client.execute(
      address, denom, msg, 'auto', null,
    )
  }
}

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import { coin } from '@cosmjs/stargate';

export const nativeUndelegate = async (
  client: SigningCosmWasmClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => await client.undelegateTokens(
  address, valAddress, coin(amount, allianceDenom), 'auto', null,
)

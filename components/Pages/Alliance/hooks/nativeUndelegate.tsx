import { coin } from '@cosmjs/amino';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';

export const nativeUndelegate = async (
  client: SigningCosmWasmClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => await client.undelegateTokens(
  address, valAddress, coin(amount, allianceDenom), 'auto', null,
)

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx'

export const allianceDelegate = async (

  client: SigningCosmWasmClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => {
  /*
   * Const handleMsg = new AllianceMsgDelegate(
   *   address,
   *   valAddress,
   *   new Coin(allianceDenom, amount),
   * )
   */
  const msgDelegate = MsgDelegate.fromJSON({
    delegatorAddress: address,
    validatorAddress: valAddress,
    '@type': '/alliance.alliance.MsgDelegate',
    amount: {
      denom: allianceDenom,
      amount,
    },
  })

  const anyMsgDelegate = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: msgDelegate,
  };

  return await client.signAndBroadcast(
    address, [anyMsgDelegate], 'auto', null,
  )
}

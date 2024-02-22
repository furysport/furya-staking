import { SigningStargateClient } from '@cosmjs/stargate';
import { Coin } from '@terra-money/feather.js';
import { MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
export const allianceRedelegate = async (
  client: SigningStargateClient,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => await client.signAndBroadcast(
  address, [({
    typeUrl: '/alliance.alliance.MsgRedelegate',
    value: MsgBeginRedelegate.fromJSON({
      delegatorAddress: address,
      validatorSrcAddress,
      validatorDstAddress,
      amount: new Coin(allianceDenom, amount),
    }),
  })], 'auto',
)

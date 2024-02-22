import { SigningStargateClient } from '@cosmjs/stargate';
import { Coin } from '@terra-money/feather.js';
import { MsgUndelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const allianceUndelegate = async (
  client: SigningStargateClient,
  valAddress: string,
  address: string,
  amount: string,
  allianceDenom: string,
) => await client.signAndBroadcast(
  address, [({
    typeUrl: '/alliance.alliance.MsgUndelegate',
    value: MsgUndelegate.fromJSON({
      delegatorAddress: address,
      validatorAddress: valAddress,
      amount: new Coin(allianceDenom, amount),
    }),
  })], 'auto',
)

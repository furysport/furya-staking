import { SigningStargateClient } from '@cosmjs/stargate'
import { MsgClaimDelegationRewards } from 'components/Pages/Alliance/MsgClaimDelegationRewards'
import { MsgWithdrawDelegatorReward } from 'components/Pages/Alliance/MsgWithdrawDelegatorReward'
import { ActionType } from 'components/Pages/Dashboard'

export const claimAllRewards = async (
  client: SigningStargateClient,
  delegations: any, address: string,
) => {
  const msgs = delegations.map(({ delegation }) => {
    if (delegation.denom === 'uwhale') {
      return ({
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: MsgWithdrawDelegatorReward.fromJSON({
          delegatorAddress: delegation.delegator_address,
          validatorAddress: delegation.validator_address,
        }),
      })
    } else {
      return ({
        typeUrl: '/alliance.alliance.MsgClaimDelegationRewards',
        value: MsgClaimDelegationRewards.fromJSON({
          delegatorAddress: delegation.delegator_address,
          validatorAddress: delegation.validator_address,
          denom: delegation.denom,
        }),
      })
    }
  })
  const result = await client.signAndBroadcast(
    address, msgs, 'auto',
  )
  return { result,
    actionType: ActionType.claim }
}

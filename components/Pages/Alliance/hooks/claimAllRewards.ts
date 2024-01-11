import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import {
  MsgWithdrawDelegatorReward,
  MsgClaimDelegationRewards,
} from '@terra-money/feather.js';
import { ActionType } from 'components/Pages/Dashboard';

export const claimAllRewards = async (wallet: SigningCosmWasmClient,
  delegations: any) => {
  const msgs = delegations.map(({ delegation }) => {
    if (delegation.denom === 'uwhale') {
      return new MsgWithdrawDelegatorReward(delegation.delegator_address,
        delegation.validator_address);
    } else {
      return new MsgClaimDelegationRewards(
        delegation.delegator_address,
        delegation.validator_address,
        delegation.denom,
      );
    }
  })
  const result = await wallet.client.post({ chainID: 'migaloo-1',
    msgs })
  const actionType = ActionType.claim
  return { result,
    actionType }
}

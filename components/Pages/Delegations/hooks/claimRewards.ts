import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import { MsgClaimDelegationRewards} from '@terra-money/feather.js';

export const claimRewards = async (
    client: TerraStationWallet,
    delegations: any
) => {
    const msgs = delegations.map(({ delegation }) => {
            return new MsgClaimDelegationRewards(
                delegation.delegator_address,
                delegation.validator_address,
                delegation.denom
            ).packAny()
        })

    return await client.client.post({ chainID: 'migaloo-1', msgs: msgs });
};
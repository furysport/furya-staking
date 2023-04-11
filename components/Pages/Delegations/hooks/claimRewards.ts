import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
import {Fee, MsgClaimDelegationRewards} from '@terra-money/feather.js';
import {estimateFee} from "components/Pages/Delegations/hooks/feeEstimation";

export const claimRewards = async (
    wallet: TerraStationWallet,
    delegations: any,
    address: string,
) => {
    const msgs = delegations.map(({ delegation }) => {
            return new MsgClaimDelegationRewards(
                delegation.delegator_address,
                delegation.validator_address,
                delegation.denom
            )})

    const feeEstimation = await estimateFee(wallet,address,msgs)
    const amounts = feeEstimation.amount
    const gasLimit = feeEstimation.gas_limit

    console.log(amounts)
    console.log(gasLimit)

    return await wallet.client.post({ chainID: 'migaloo-1', msgs: msgs, fee:new Fee(gasLimit, amounts) });
};
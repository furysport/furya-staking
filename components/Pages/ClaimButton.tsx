import {useMemo} from 'react'
import {ActionType} from 'components/Pages/Dashboard';
import CustomButton from 'components/CustomButton';
import useAllianceTransaction from "components/Pages/Alliance/hooks/useAllianceTransaction"
import {TxStep} from "types/blockchain"
import useTransaction from "hooks/useTransaction"
import {useRecoilValue} from "recoil"
import {tabState, TabType} from "state/tabState"

const ClaimButton = ({isWalletConnected, onOpenModal, totalRewards, rewardDenoms = null}) => {
    const {submit: allianceSubmit, txStep: allianceTxStep} = useAllianceTransaction()
    const {submit, txStep: contractTxStep} = useTransaction()
    const tabType = useRecoilValue(tabState)

    const txStep = useMemo(() => tabType === TabType.alliance ? allianceTxStep : contractTxStep, [tabType, allianceTxStep, contractTxStep])
    const onClaim = async () => {
        if (tabType === TabType.alliance) {
            await allianceSubmit(ActionType.claim, null, null, null, null);
        } else {
            await submit(ActionType.claim, null, null, rewardDenoms)
        }
    };
    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) return 'Connect Wallet';
        else if (Number(totalRewards) === 0) return 'No Rewards';
        else return 'Claim';
    }, [totalRewards, isWalletConnected]);

    const isLoading =
        txStep === TxStep.Estimating ||
        txStep === TxStep.Posting ||
        txStep === TxStep.Broadcasting
    return (
        <CustomButton
            buttonLabel={buttonLabel}
            transform={'translateY(-15px)'}
            onClick={
                (isWalletConnected && Number(totalRewards) > 0) ? onClaim : onOpenModal
            }
            disabled={(isWalletConnected && Number(totalRewards) === 0) || isLoading}
            loading={isLoading}
            height="50px"
            width="250px"
        />
    )
}
export default ClaimButton

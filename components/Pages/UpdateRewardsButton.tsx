import { useMemo } from 'react'
import { ActionType } from 'components/Pages/Dashboard';
import CustomButton from 'components/CustomButton';
import useTransaction from "components/Pages/Alliance/hooks/useTransaction";
import {TxStep} from "types/blockchain";

const UpdateRewardsButton = ({ isWalletConnected, onOpenModal }) => {
    const { submit, txStep } = useTransaction()
    const onUpdate= () => {
        submit(ActionType.updateRewards, null, null, null, null);
    };
    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) return 'Connect Wallet'
        else return 'Update Rewards'
    }, [ isWalletConnected]);

    const isLoading =
        txStep === TxStep.Estimating ||
        txStep === TxStep.Posting ||
        txStep === TxStep.Broadcasting;
    return (
        <CustomButton
            buttonLabel={buttonLabel}
            transform={'translateY(-15px)'}
            onClick={
                isWalletConnected ? onUpdate : onOpenModal
            }
            disabled={!isWalletConnected || isLoading}
            loading={isLoading}
            height="25px"
            width="125px"
        />
    );
};
export default UpdateRewardsButton;

import {useMemo} from 'react'
import {ActionType} from 'components/Pages/Dashboard';
import CustomButton from 'components/CustomButton';
import useTransaction from "components/Pages/Alliance/hooks/useTransaction";
import {TxStep} from "types/blockchain";

const UpdateRewardsButton = ({isWalletConnected}) => {
    const {submit, txStep} = useTransaction()
    const onUpdate = () => submit(ActionType.updateRewards, null, null, null, null)

    const isLoading =
        txStep === TxStep.Estimating ||
        txStep === TxStep.Posting ||
        txStep === TxStep.Broadcasting

    return (
        <CustomButton
            isTransparent={true}
            isBold={false}
            buttonLabel={'Update'}
            transform={'translateY(-8px)'}
            onClick={() => onUpdate()}
            disabled={!isWalletConnected || isLoading}
            loading={isLoading}
            height="25px"
            width="125px"
        />
    );
};
export default UpdateRewardsButton;

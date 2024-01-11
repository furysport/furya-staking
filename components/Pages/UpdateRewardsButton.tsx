import CustomButton from 'components/CustomButton';
import { useAllianceTransaction } from 'components/Pages/Alliance/hooks/useAllianceTransaction';
import { ActionType } from 'components/Pages/Dashboard';
import { TxStep } from 'types/blockchain';

const UpdateRewardsButton = () => {
  const { submit, txStep } = useAllianceTransaction()
  const onUpdate = () => {
    submit(
      ActionType.updateRewards, null, null, null, null,
    );
  }

  const isLoading =
    txStep === TxStep.Estimating ||
    txStep === TxStep.Posting ||
    txStep === TxStep.Broadcasting;
  return (
    <CustomButton
      isTransparent={true}
      isBold={false}
      buttonLabel={'Update'}
      transform={'translateY(-8px)'}
      onClick={onUpdate}
      disabled={isLoading}
      loading={isLoading}
      height="25px"
      width="125px"
    />
  );
};
export default UpdateRewardsButton;

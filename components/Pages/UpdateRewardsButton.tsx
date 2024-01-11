import { useMemo } from 'react'

import CustomButton from 'components/CustomButton';
import { useAllianceTransaction } from 'components/Pages/Alliance/hooks/useAllianceTransaction';
import { ActionType } from 'components/Pages/Dashboard';
import { TxStep } from 'types/blockchain';

const UpdateRewardsButton = ({ isWalletConnected, onOpenModal }) => {
  const { submit, txStep } = useAllianceTransaction()
  const onUpdate = () => {
    submit(
      ActionType.updateRewards, null, null, null, null,
    );
  };
  const buttonLabel = useMemo(() => {
    if (!isWalletConnected) {
      return 'Connect Wallet'
    } else {
      return 'Update'
    }
  }, [isWalletConnected]);

  const isLoading =
    txStep === TxStep.Estimating ||
    txStep === TxStep.Posting ||
    txStep === TxStep.Broadcasting;
  return (
    <CustomButton
      isTransparent={true}
      isBold={false}
      buttonLabel={buttonLabel}
      transform={'translateY(-8px)'}
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

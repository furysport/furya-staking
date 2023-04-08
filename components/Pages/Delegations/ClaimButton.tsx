import useDelegations from 'hooks/useDelegations';
import {Button} from '@chakra-ui/react'
import {useMemo} from 'react';
import useTransaction from "components/Pages/Delegations/hooks/useTransaction";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {TxStep} from "components/Pages/Delegations/ActionsComponent";

const ClaimButton = ({isWalletConnected, onOpenModal, address}) => {

  const { data: { delegations = [], totalRewards} = {} } = useDelegations({address})


  const {submit, txStep} = useTransaction()

  const onClaim = () => {
    submit(ActionType.claim, null, null, null,null)
  }
  const buttonLabel = useMemo(() => {
    if (!isWalletConnected) return 'Connect Wallet'
    else if ((Number(totalRewards) === 0)) return 'No Rewards'
    else return 'Claim'
  }, [totalRewards, isWalletConnected])


  return (
    <Button
      variant="primary"
      minW="200px"
      minH="50px"
      style={{ transform: 'translateY(-10px)' }}
      size="m"
      disabled={!isWalletConnected || totalRewards === 0 }
      onClick={isWalletConnected && totalRewards !==0 ? onClaim : onOpenModal}
      isLoading={
        txStep == TxStep.Estimating ||
        txStep == TxStep.Posting ||
        txStep == TxStep.Broadcasting
      }>
      {buttonLabel}
    </Button>
  )
}

export default ClaimButton
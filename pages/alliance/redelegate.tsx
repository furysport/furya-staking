import ActionsComponent from 'components/Pages/Alliance/ActionsComponent';
import { ActionType } from 'components/Pages/Dashboard';
import { useRouter } from 'next/router';

const RedelegatePage = () => {
  const router = useRouter();
  const { validatorDestAddress } = router.query
  const { validatorSrcAddress } = router.query
  const { tokenSymbol } = router.query

  return (
    <ActionsComponent
      globalAction={ActionType.redelegate}
      validatorDestAddress={validatorDestAddress as string}
      validatorSrcAddress={validatorSrcAddress as string}
      tokenSymbol={tokenSymbol as string}
    />
  );
};

export default RedelegatePage;

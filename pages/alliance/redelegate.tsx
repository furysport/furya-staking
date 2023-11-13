import ActionsComponent from 'components/Pages/Alliance/ActionsComponent';
import { ActionType } from 'components/Pages/Dashboard';
import { useRouter } from 'next/router';

const RedelegatePage = () => {
  const router = useRouter();
  const { validatorDestAddress } = router.query;
  const { validatorSrcAddress } = router.query;
  const { tokenSymbol } = router.query;

  // @ts-ignore
  return (
    <ActionsComponent
      globalAction={ActionType.redelegate}
      validatorDestAddress={validatorDestAddress}
      validatorSrcAddress={validatorSrcAddress}
      tokenSymbol={tokenSymbol}
    />
  );
};

export default RedelegatePage;

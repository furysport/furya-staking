import ActionsComponent from 'components/Pages/Alliance/ActionsComponent';
import { ActionType } from 'components/Pages/Dashboard';
import { useRouter } from 'next/router';

const DelegatePage = () => {
  const router = useRouter();
  const { validatorDestAddress } = router.query;
  const { tokenSymbol } = router.query;

  return (
    <ActionsComponent
      globalAction={ActionType.delegate}
      validatorDestAddress={validatorDestAddress as string}
      tokenSymbol={tokenSymbol as string}
    />
  );
};

export default DelegatePage;

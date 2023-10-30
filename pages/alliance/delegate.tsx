import { useRouter } from 'next/router';
import ActionsComponent from 'components/Pages/Alliance/ActionsComponent';
import { ActionType } from 'components/Pages/Dashboard';

const DelegatePage = () => {
  const router = useRouter();
  const validatorDestAddress = router.query.validatorDestAddress;
  const tokenSymbol = router.query.tokenSymbol;

  // @ts-ignore
  return (
    <ActionsComponent
      globalAction={ActionType.delegate}
      validatorDestAddress={validatorDestAddress}
      tokenSymbol={tokenSymbol}
    />
  );
};

export default DelegatePage;

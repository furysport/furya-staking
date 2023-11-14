import { Undelegate } from 'components/Pages/Undelegate';
import { useRouter } from 'next/router';

const UndelegatePage = () => {
  const router = useRouter();
  const { tokenSymbol } = router.query
  return <Undelegate tokenSymbol={tokenSymbol}/>
}

export default UndelegatePage;

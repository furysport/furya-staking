import { useRouter } from 'next/router';
import ActionsComponent from "components/Pages/Delegations/ActionsComponent";
import { ActionType } from "components/Pages/Delegations/Dashboard";

const DelegatePage = () => {
    const router = useRouter();
    const validatorAddress = router.query.validatorAddress;
    const tokenSymbol = router.query.tokenSymbol;

    // @ts-ignore
    return <ActionsComponent globalAction={ActionType.delegate} validatorAddress={validatorAddress} tokenSymbol={tokenSymbol}/>;
};

export default DelegatePage;

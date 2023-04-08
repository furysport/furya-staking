import { useRouter } from 'next/router';
import ActionsComponent from "components/Pages/Delegations/ActionsComponent";
import { ActionType } from "components/Pages/Delegations/Dashboard";

const DelegatePage = () => {
    const router = useRouter();
    const validatorAddress = router.query.validatorAddress;

    return <ActionsComponent globalAction={ActionType.delegate} validatorAddress={validatorAddress} />;
};

export default DelegatePage;

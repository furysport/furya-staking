import ActionsComponent from "components/Pages/Delegations/ActionsComponent";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {useRouter} from "next/router";

const RedelegatePage = () => {

    const router = useRouter();
    const validatorAddress = router.query.validatorAddress;

    return <ActionsComponent globalAction={ActionType.redelegate} validatorAddress={validatorAddress} />;
}

export default RedelegatePage

import ActionsComponent from "components/Pages/Delegations/ActionsComponent";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {useRouter} from "next/router";

const RedelegatePage = () => {

    const router = useRouter();
    const validatorAddress = router.query.validatorAddress;
    const tokenSymbol = router.query.tokenSymbol;

    // @ts-ignore
    return <ActionsComponent globalAction={ActionType.redelegate} validatorAddress={validatorAddress} tokenSymbol={tokenSymbol}/>;
}

export default RedelegatePage

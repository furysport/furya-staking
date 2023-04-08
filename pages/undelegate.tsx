import ActionsComponent from "../components/Pages/Delegations/ActionsComponent";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {useRouter} from "next/router";

const UndelegatePage = () => {

    const router = useRouter();
    const validatorAddress = router.query.validatorAddress;

    return <ActionsComponent globalAction={ActionType.undelegate} validatorAddress={validatorAddress} />;
}

export default UndelegatePage

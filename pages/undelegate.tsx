import ActionsComponent from "../components/Pages/Delegations/ActionsComponent";
import {ActionType} from "../components/Pages/Delegations/Dashboard";

const UndelegatePage = () => {


    return <ActionsComponent globalAction={ActionType.undelegate}/>
}

export default UndelegatePage

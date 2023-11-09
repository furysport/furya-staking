import {Delegate} from "components/Pages/Delegate"
import {useRouter} from "next/router"

const DelegatePage = () => {
 const router = useRouter();
 const tokenSymbol = router.query.tokenSymbol;
 return <Delegate tokenSymbol={tokenSymbol}/>

}

export default DelegatePage;

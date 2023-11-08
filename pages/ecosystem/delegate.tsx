import {Delegate} from "components/Pages/Delegate";
import {useRouter} from "next/router";
import {VStack} from "@chakra-ui/react";
import Header from "components/Header/Header";

const DelegatePage = () => {
 const router = useRouter();
 const tokenSymbol = router.query.tokenSymbol;
 return <VStack w={"1270px"}>
  <Header/>
  <Delegate tokenSymbol={tokenSymbol}/>
    </VStack>
}

export default DelegatePage;

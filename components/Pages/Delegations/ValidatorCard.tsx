import {Button, HStack, Text, VStack} from "@chakra-ui/react";
import Loader from "components/Loader";
import {FC} from "react";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {useRouter} from "next/router";

interface ValidatorCardProps{
    name: string,
    isLoading: boolean,
    voting_power: number,
commission: number
}
const ValidatorCard: FC<ValidatorCardProps> = ({name,isLoading, voting_power, commission})=>{

    const router = useRouter()

    const onClick = async(action: ActionType)=>{
        await  router.push(`/${ActionType[action]}`)
    }
    return <HStack
        background={"#1C1C1C"}
        borderRadius={"30px"}
        px={5}
        alignItems="center"
        verticalAlign="center"
        minH={75}
        minW={800}
        spacing={20}
        justifyContent="space-between"
        width="100%"
        overflow="hidden"
        position="relative"
        display="flex">
        {isLoading ?
            <HStack
                minW={100}
                minH={100}
                width="full"
                alignContent="center"
                justifyContent="center"
                alignItems="center">
                <Loader/>
            </HStack> :
                <><Text>{name}</Text>
                    <Text>{voting_power}</Text>
                    <Text>{commission}</Text>
                    <HStack>
                    <Button onClick={()=>onClick(ActionType.delegate)}>Delegate</Button>
                    <Button onClick={()=>onClick(ActionType.undelegate)}>Redelegate</Button>
                    <Button onClick={()=>onClick(ActionType.redelegate)}>Undelegate</Button>
                    </HStack>
                </>
        }
    </HStack>
}

export default ValidatorCard
import {Button, Divider, HStack, Text, VStack} from "@chakra-ui/react";
import Loader from "components/Loader";
import {FC} from "react";

interface UndelegationsProps{
    isLoading: boolean,
    whale: number
    ampWhale: number
    bWhale: number
}
const RewardsComponent: FC<UndelegationsProps> = ({isLoading, whale, ampWhale, bWhale})=>{
    return <VStack
        width="full"
        background={"#1C1C1C"}
        alignItems="flex-start"
        px={7}
        pt={5}
        spacing={1}
        borderRadius={"20px"}
        minH={320}
        minW={500}
        as="form"
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
            </HStack> :(
                <><Text color={"grey"}>Rewards</Text>
                    <HStack justifyContent="space-between" width="100%"> <Text fontSize={27} fontWeight={"bold"}>{`$${(1234564).toLocaleString()}`}</Text><Button>Claim Rewards</Button></HStack>
                    <VStack
                        minW={550}
                        p={5}
                        alignSelf={"center"}
                        backgroundColor="black"
                        spacing={5}
                        justifyContent={"space-between"}
                        borderRadius={20}>
                        <HStack justifyContent="space-between" width="100%">
                            <Text>WHALE</Text>
                            <Text>{whale}</Text>
                        </HStack>
                        <Divider/>
                        <HStack justifyContent="space-between" width="100%">
                            <Text>ampWHALE</Text>
                            <Text>{ampWhale}</Text>
                        </HStack>
                        <Divider/>
                        <HStack justifyContent="space-between" width="100%">
                            <Text>bWHALE</Text>
                            <Text>{bWhale}</Text>
                        </HStack>
                    </VStack>

                </>)
        }
    </VStack>
}

// @ts-ignore
export default RewardsComponent
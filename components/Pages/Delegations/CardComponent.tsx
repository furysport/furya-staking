import {HStack, Text, VStack} from "@chakra-ui/react";
import Loader from "components/Loader";
import {FC} from "react";

interface CardComponentProps{
    title: string,
    isLoading: boolean,
    value: number
}
const CardComponent: FC<CardComponentProps> = ({title,isLoading,value})=>{
    return <VStack
        width="full"
        background={"#1C1C1C"}
        pl={7}
        spacing={1}
        borderRadius={"20px"}
        alignItems="flex-start"
        verticalAlign="center"
        minH={120}
        minW={300}
        as="form"
        overflow="hidden"
        position="relative"
        display="flex"
        justifyContent="center">
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
            <><Text color={"grey"}>{title}</Text>
            <Text fontSize={27} fontWeight={"bold"}>{`$${value.toLocaleString()}`}</Text></>)
        }
    </VStack>
}

export default CardComponent
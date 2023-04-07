import { HStack, VStack, Text } from "@chakra-ui/react";
import Loader from "components/Loader";
import { FC } from "react";
import { CustomTooltip } from "components/Pages/Delegations/CustomTooltip";
import { TokenData} from "components/Pages/Delegations/Dashboard";

interface CardComponentProps {
    title: string
    tokenData: TokenData[];
    isLoading: boolean;
    isWalletConnected: boolean;
}

const CardComponent: FC<CardComponentProps> = ({title, tokenData,isLoading, isWalletConnected }) => {

    const sumAndMultiplyValues = (): number =>
        tokenData?.reduce((total, item) => {
           return  total + item.value * (item?.dollarValue !== undefined ? item?.dollarValue ?? 0 : 0);
        }, 0);

    console.log(tokenData)
    const summedAndMultipliedValues = isWalletConnected ? `$${sumAndMultiplyValues()?.toLocaleString()}` : "n/a";
    console.log(summedAndMultipliedValues)
    return (
        <VStack
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
            {isLoading ? (
                <HStack
                    minW={100}
                    minH={100}
                    width="full"
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Loader />
                </HStack>
            ) : (<><Text color={"grey"}>{title}</Text>
                <CustomTooltip
                    isWalletConnected={isWalletConnected}
                    data={tokenData}
                    label={`${summedAndMultipliedValues}`}/>
            </>)}
        </VStack>
    );
};

export default CardComponent;

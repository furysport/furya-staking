import { HStack, VStack, Text } from "@chakra-ui/react";
import Loader from "components/Loader";
import { FC } from "react";
import { CustomTooltip } from "components/Pages/Delegations/CustomTooltip";
import {DelegationData} from "components/Pages/Delegations/Dashboard";
import {TokenType} from "components/Pages/Delegations/AssetOverview";

interface CardComponentProps {
    title: string
    delegationData: DelegationData;
    tokenType: TokenType;
    isLoading: boolean;
    isWalletConnected: boolean;
}

const CardComponent: FC<CardComponentProps> = ({title,tokenType, delegationData,isLoading, isWalletConnected }) => {
    const sumAndMultiplyValues = (delegationData: DelegationData): number =>
        delegationData[TokenType[tokenType]].reduce((total, item) => {
            return total + item.value * item.price;
        }, 0);

    const summedAndMultipliedValues = isWalletConnected ? `$${sumAndMultiplyValues(delegationData).toLocaleString()}` : "n/a";

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
                    data={delegationData[TokenType[tokenType]]}
                    label={`${summedAndMultipliedValues}`}/>
            </>)}
        </VStack>
    );
};

export default CardComponent;

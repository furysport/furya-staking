import React, {FC, useEffect, useState} from 'react'

import {Button, HStack, Text, VStack} from '@chakra-ui/react'

import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {StakingData} from "./types/StakingData";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";
import CardComponent from "components/Pages/Delegations/CardComponent";
import AssetOverview, { WhaleType} from "./AssetOverview";
import ValidatorCard from "components/Pages/Delegations/ValidatorCard";
import RewardsComponent from "components/Pages/Delegations/RewardsComponent";

export enum ActionType {
    delegate, redelegate, undelegate
}

const Dashboard: FC = () => {
    const [{chainId, status, client, address, network}] = useRecoilState(walletState)

    const isWalletConnected: boolean = status === WalletStatusType.connected
    //const chains: Array<any> = useChains()
    //const currentChain = chains.find((row: { chainId: string }) => row.chainId === chainId)
    //const currentChainName = currentChain?.label.toLowerCase()

    const data: StakingData[] = [{whaleType: WhaleType.WHALE, value: 5003, color: "#244228"},
        {whaleType: WhaleType.ampWHALE, value: 34232, color: "#7CFB7D"},
        {whaleType: WhaleType.bWHALE, value: 131230, color: "#3273F6"}]

    const [updatedData, setData] = useState(null)

    const whalePrice = useWhalePrice()


    useEffect(() => {
        setData(data)
    }, [])
    const [isLoading, setLoading] = useState<boolean>(false)

    return (
        <VStack pt={12} minW={1270} alignSelf="center" alignItems={"flex-start"} spacing={6}>
            <Text fontSize={35} fontWeight={"bold"}>Delegations</Text>
            <HStack width="full" paddingY={5} spacing={10}>
                <CardComponent isLoading={false} title={"Balances"} value={(1234322)}/>
                <CardComponent isLoading={false} title={"Delegations"} value={(34322)}/>
                <CardComponent isLoading={false} title={"Undelegations"} value={(54322)}/>
            </HStack>
            <HStack width="full" spacing={10}>
                <AssetOverview isLoading={isLoading} data={updatedData} isWalletConnected={isWalletConnected}/>
                <RewardsComponent isLoading={false} whale={100} ampWhale={1234} bWhale={4536}/>
            </HStack>
            <HStack pt={10} justifyContent="space-between" width="100%"> <Text fontSize={25} fontWeight={"bold"}>Validators</Text>
                <HStack><Button>All</Button><Button>Active</Button><Button>Inactive</Button></HStack></HStack>
            <HStack
                background={"transparent"}
                borderRadius={"30px"}
                px={5}
                alignItems="center"
                verticalAlign="center"
                minH={10}
                minW={800}
                spacing={230}
                width="100%"
                overflow="hidden"
                position="relative"
                display="flex">
                    <Text>Name</Text>
                        <Text>Voting Power</Text>
                        <Text>Commission</Text>
                        <HStack>
                            <Text>Commission</Text>
                        </HStack>
            </HStack>
            <ValidatorCard name={"Validator 1"} commission={1} voting_power={5} isLoading={false}/>
            <ValidatorCard name={"Validator 2"} commission={1} voting_power={5} isLoading={false}/>
            <ValidatorCard name={"Validator 3"} commission={1} voting_power={5} isLoading={false}/>
            <VStack alignSelf={{base: "center", xl: "end"}}>

            </VStack>
        </VStack>
    );
};

export default Dashboard

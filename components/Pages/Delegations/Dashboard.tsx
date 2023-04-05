import React, {FC, useEffect, useState} from 'react'

import {Button, HStack, Text, VStack} from '@chakra-ui/react'

import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";
import CardComponent from "components/Pages/Delegations/CardComponent";
import AssetOverview, {Token, TokenType} from "./AssetOverview";
import ValidatorCard from "components/Pages/Delegations/ValidatorCard";
import RewardsComponent from "components/Pages/Delegations/RewardsComponent";
import TriangleUpIcon from "components/icons/TriangleUpIcon";
import TriangleDownIcon from "components/icons/TriangleDownIcon";

enum ButtonType {all, active, inactive}

export enum ActionType {
    delegate, redelegate, undelegate, claim
}

export type TokenData = {
    color: string
    value: number
    price: number
    token?: Token
    tokenSymbol?: string

}

interface ValidatorData {
    commission: number,
    votingPower : number,
    name: string
}

export interface DelegationData {
    delegated: TokenData[]
    undelegated: TokenData[]
    liquid: TokenData[]
    rewards: TokenData[]
}

const Dashboard: FC = () => {
    const [{status}] = useRecoilState(walletState)

    const isWalletConnected: boolean = status === WalletStatusType.connected
    //const chains: Array<any> = useChains()
    //const currentChain = chains.find((row: { chainId: string }) => row.chainId === chainId)
    //const currentChainName = currentChain?.label.toLowerCase()

    const liquidData: TokenData[] = [{token: Token.WHALE, price: 0.024, value: 10003, color: "#244228"},
        {token: Token.ampLUNA, value: 39232, price: 1.23, color: "#7CFB7D"},
        {token: Token.bLUNA, price: 1.23, value: 230, color: "#3273F6"}]
    const delegatedData: TokenData[] = [{token: Token.WHALE, price: 1.23, value: 5000000, color: "#244228"},
        {token: Token.ampLUNA, price: 1.23, value: 34232, color: "#7CFB7D"},
        {token: Token.bLUNA, price: 1.23, value: 131230, color: "#3273F6"}]
    const undelegatedData: TokenData[] = [{token: Token.WHALE, price: 1.23, value: 0, color: "#244228"},
        {token: Token.ampLUNA, price: 1.23, value: 0, color: "#7CFB7D"},
        {token: Token.bLUNA, price: 1.23, value: 0, color: "#3273F6"}]

    const rewardsData: TokenData[] = [{token: Token.WHALE, price: 1.23, value: 0, color: "#244228"},
        {token: Token.ampLUNA, price: 1.23, value: 0, color: "#7CFB7D"},
        {token: Token.bLUNA, price: 1.23, value: 0, color: "#3273F6"}]

    const [updatedData, setData] = useState(null)
    const [isCommissionAscending, setCommissionAscending] = useState(null)
    const [isVotingPowerAscending, setVotingPowerAscending] = useState(null)
    const [activeButton, setActiveButton] = useState(ButtonType.all);

    const delegationData: DelegationData = {
        delegated: delegatedData,
        undelegated: undelegatedData, liquid: liquidData, rewards: rewardsData
    }

    const validatorData : ValidatorData[] = [{name: "VALIDATOR 1", commission: 0.05,votingPower:0.03},{name: "VALIDATOR 2", commission: 0.03,votingPower:0.045},{name: "VALIDATOR 3", commission: 0.01,votingPower:0.023}]
    const [validators, setValidators] = useState<ValidatorData[]>(validatorData)
    const handleClick = (buttonNumber) => {
        setActiveButton(buttonNumber);
    };
    const whalePrice = useWhalePrice()

    const onCommissionAscending = ()=>{
        setCommissionAscending(prevState =>prevState === null ? true: !prevState)
        setValidators(validatorData.sort((a,b)=>a.commission - b.commission))
    }
    const onCommissionDescending = ()=>{
        setCommissionAscending(prevState => !prevState)
        setValidators(validatorData.sort((a,b)=>b.commission - a.commission))
    }
    const onVotingPowerAscending = ()=>{
        setVotingPowerAscending(prevState =>prevState === null ?true: !prevState)
        setValidators(validatorData.sort((a,b)=>a.votingPower - b.votingPower))
    }
    const onVotingPowerDescending = ()=>{
        setVotingPowerAscending(prevState => !prevState)
        setValidators(validatorData.sort((a,b)=>b.votingPower - a.votingPower))
    }

    useEffect(() => {
        setData(delegationData)
    }, [])
    const [isLoading, setLoading] = useState<boolean>(false)

    return (
        <VStack
            pt={12}
            minW={1270}
            alignSelf="center"
            alignItems={"flex-start"}
            spacing={6}>
            <Text
                fontSize={35}
                fontWeight={"bold"}>
                Delegations
            </Text>
            <HStack
                width="full"
                paddingY={5}
                spacing={10}>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={false}
                    title={"Balances"}
                    delegationData={delegationData}
                    tokenType={TokenType.liquid}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={false}
                    title={"Delegations"}
                    delegationData={delegationData}
                    tokenType={TokenType.delegated}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={false}
                    title={"Undelegations"}
                    delegationData={delegationData}
                    tokenType={TokenType.undelegated}/>
            </HStack>
            <HStack
                width="full"
                spacing={10}>
                <AssetOverview
                    isLoading={isLoading}
                    data={updatedData && updatedData[TokenType[TokenType.delegated]]}
                    isWalletConnected={isWalletConnected}/>
                <RewardsComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={false}
                    data={updatedData && updatedData[TokenType[TokenType.rewards]]}/>
            </HStack>
            <HStack
                pt={10}
                justifyContent="space-between"
                width="100%">
                <Text
                    fontSize={25}
                    fontWeight={"bold"}>
                    Validators
                </Text>
                <HStack
                    background={"black"}
                    borderRadius={"30px"}
                    py={3}
                    px={15}
                    alignItems="center"
                    verticalAlign="center">
                    <Button
                        alignSelf="center"
                        style={{backgroundColor: activeButton === 0 ? "#6ACA70" : "black", textTransform: "capitalize"}}
                        borderRadius="full"
                        width="100%"
                        variant="primary"
                        isActive={false}
                        disabled={activeButton !== 0}
                        maxWidth={200}
                        h={30}
                        isLoading={false}
                        onClick={() => setActiveButton(0)
                        }>
                        {"All"}
                    </Button>
                    <Button
                        alignSelf="center"
                        style={{backgroundColor: activeButton === 1 ? "#6ACA70" : "black", textTransform: "capitalize"}}
                        borderRadius="full"
                        width="100%"
                        variant="primary"
                        isActive={true}
                        disabled={activeButton !== 1}
                        maxWidth={200}
                        h={30}
                        isLoading={false}
                        onClick={() => setActiveButton(1)
                        }>
                        {"Active"}
                    </Button>
                    <Button
                        alignSelf="center"
                        style={{backgroundColor: activeButton === 2 ? "#6ACA70" : "black", textTransform: "capitalize"}}
                        borderRadius="full"
                        width="100%"
                        variant="primary"
                        isActive={true}
                        disabled={activeButton !== 2}
                        maxWidth={200}
                        h={30}
                        isLoading={false}
                        onClick={() => setActiveButton(2)}>
                        {"Inactive"}
                    </Button>
                </HStack>
            </HStack>
            <HStack
                background={"transparent"}
                borderRadius={"30px"}
                px={5}
                verticalAlign="center"
                minH={10}
                spacing={140}
                width="100%"
                overflow="hidden"
                position="relative"
                display="flex">
                <Text pr={120}>Name</Text>
                <HStack pr={1}>
                    <Text>Voting Power</Text>
                    <VStack>
                        {isVotingPowerAscending || isVotingPowerAscending === null?
                            <TriangleUpIcon onClick={onVotingPowerAscending}
                                            color={"white"}/> :
                            <TriangleDownIcon onClick={onVotingPowerDescending}
                                              color={"white"}/>
                        }</VStack>
                </HStack>

                <HStack pr={3}>
                    <Text>Commission</Text>
                    <VStack>
                        {isCommissionAscending || isCommissionAscending === null?
                            <TriangleUpIcon onClick={onCommissionAscending}
                                            color={"white"}/> :
                            <TriangleDownIcon onClick={onCommissionDescending}
                                              color={"white"}/>
                        }</VStack>
                </HStack>
                <HStack>
                    <Text>Actions</Text>
                </HStack>
            </HStack>
            {validators.map(data=>(<ValidatorCard key={data.name} name={data.name} isLoading={false} voting_power={data.votingPower} commission={data.commission}/>))}
        </VStack>
    );
};

export default Dashboard

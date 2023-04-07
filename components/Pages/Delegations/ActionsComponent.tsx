import {ArrowBackIcon} from "@chakra-ui/icons"
import {Box, Button, HStack, IconButton, Text, useDisclosure, VStack} from "@chakra-ui/react"
import {useRecoilState} from "recoil"
import {walletState, WalletStatusType} from "state/atoms/walletAtoms"
import Redelegate from "./Redelegate"
import Delegate, {TokenPriceBalance} from "./Delegate"
import {useRouter} from 'next/router'

import {delegationAtom, DelegationState} from "state/atoms/delegationAtoms";
import React, {useMemo, useState} from "react";
import WalletModal from "../../Wallet/Modal/Modal";

import Loader from "../../Loader";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import Undelegate from "components/Pages/Delegations/Undelegate";
import {useTokenList} from "hooks/useTokenList";
import {useMultipleTokenBalance} from "hooks/useTokenBalance";
import useTransaction from "components/Pages/Delegations/hooks/useTransaction";

export enum TxStep {
    /**
     * Idle
     */
    Idle = 0,
    /**
     * Estimating fees
     */
    Estimating = 1,
    /**
     * Ready to post transaction
     */
    Ready = 2,
    /**
     * Signing transaction in Terra Station
     */
    Posting = 3,
    /**
     * Broadcasting
     */
    Broadcasting = 4,
    /**
     * Successful
     */
    Successful = 5,
    /**
     * Failed
     */
    Failed = 6,
}

const ActionsComponent = ({globalAction}) => {

    const [{chainId, status, client}, _] = useRecoilState(walletState)

    const isWalletConnected: boolean = status === WalletStatusType.connected
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const router = useRouter()

    const [currentDelegationState, setCurrentDelegationState] = useRecoilState<DelegationState>(delegationAtom)

    const {tokenInfoList} = useTokenList()
    const whalePrice = useWhalePrice()

    const {submit, txStep} = useTransaction()


    const {data: balances} = useMultipleTokenBalance(tokenInfoList?.map(e => e.symbol) ?? [])

    const liquidTokenPriceBalances: TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index) => ({
        price: whalePrice, balance: balances?.[index], tokenSymbol: tokenInfo.symbol
    })) ?? []
    const delegatedTokenPriceBalances: TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index) => ({
        price: whalePrice, balance: balances?.[index], tokenSymbol: tokenInfo.symbol
    })) ?? []
    const rewardsTokenPriceBalances: TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index) => ({
        price: whalePrice, balance: balances?.[index], tokenSymbol: tokenInfo.symbol
    })) ?? []

    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) return "Connect Wallet"
        else if (currentDelegationState?.amount === 0) return "Enter Amount"
        else return ActionType[globalAction]
    }, [isWalletConnected, currentDelegationState, globalAction])


    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false)


    const DelegationActionButton = ({action}) => {

        const actionString = ActionType[action].toString()

        const onClick = async () => {
            setCurrentDelegationState({...currentDelegationState, amount: 0})
            await router.push(`/${actionString}`)
        }

        return <Button
            sx={{
                "&:hover": {
                    backgroundColor: "#1C1C1C",
                    color: "#6ACA70",
                },
            }}
            color={globalAction === action ? "white" : "grey"}
            bg={"#1C1C1C"}
            fontSize={20}
            px={5}
            transform="translate(0%, -55%)"
            style={{textTransform: "capitalize"}}
            onClick={onClick}>
            {actionString}
        </Button>
    }

    return (
        <VStack
            width={{base: '100%', md: '650px'}}
            alignItems="flex-start"
            top={200}
            gap={4}
            position="absolute">
            <HStack
                justifyContent="space-between"
                width="full"
                paddingY={5}>
                <IconButton
                    variant="unstyled"
                    color="white"
                    fontSize="28px"
                    aria-label="go back"
                    icon={<ArrowBackIcon/>}
                    onClick={async () => {
                        await router.push(`/`)
                        setCurrentDelegationState({...currentDelegationState, amount: 0,
                            validatorDestName: "",
                            validatorSrcName: "",
                            validatorSrcAddress: "",
                            validatorDestAddress: ""
                        })
                    }}
                />
                <Text
                    as="h2"
                    fontSize="24"
                    fontWeight="900"
                    style={{textTransform: "capitalize"}}>
                    {ActionType[globalAction]}
                </Text>
            </HStack>
            ({isLoadingSummary && isWalletConnected ?
            <VStack
                width="full"
                background={"#1C1C1C"}
                borderRadius={"30px"}
                justifyContent="center"
                top={70}
                minH={280}
                gap={4}
                as="form"
                position="absolute"
                pb={7}
                left="50%"
                transform="translateX(-50%)"
                display="flex">
                <HStack
                    minW={100}
                    minH={100}
                    width="full"
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center">
                    <Loader/>
                </HStack>
            </VStack> :
            <VStack
                width="full"
                background={"#1C1C1C"}
                borderRadius={"30px"}
                alignItems="flex-start"
                verticalAlign="flex-start"
                top={70}
                maxH={660}
                gap={4}
                as="form"
                position="absolute"
                pb={7}
                left="50%"
                transform="translateX(-50%)"
                display="flex">
                <Box
                    border="0.5px solid grey"
                    borderRadius="30px"
                    minH={160}
                    minW={570}
                    alignSelf="center"
                    mt={"50px"}>
                    <HStack
                        spacing={0}
                        justify="center">
                        <DelegationActionButton action={ActionType.delegate}/>
                        <DelegationActionButton action={ActionType.redelegate}/>
                        <DelegationActionButton action={ActionType.undelegate}/>
                    </HStack>
                    {(() => {
                        switch (globalAction) {
                            case ActionType.delegate:
                                return <Delegate tokens={liquidTokenPriceBalances}/>;
                            case ActionType.redelegate:
                                return <Redelegate tokens={rewardsTokenPriceBalances}/>;
                            case ActionType.undelegate:
                                return <Undelegate tokens={delegatedTokenPriceBalances}/>;
                        }
                    })()}
                </Box>
                <Button
                    alignSelf="center"
                    bg="#6ACA70"
                    borderRadius="full"
                    width="100%"
                    variant="primary"
                    disabled={!isWalletConnected}
                    maxWidth={570}
                    isLoading={false}
                    onClick={async () => {
                        if (isWalletConnected) {
                            await submit(globalAction,
                                currentDelegationState.validatorDestAddress,
                                currentDelegationState.validatorSrcAddress,
                                currentDelegationState.amount,
                                currentDelegationState.denom)
                        } else {
                            onOpenModal()
                        }
                    }}
                    style={{textTransform: "capitalize"}}>
                    {buttonLabel}
                </Button>
                <WalletModal
                    isOpenModal={isOpenModal}
                    onCloseModal={onCloseModal}
                    chainId={chainId}
                />
            </VStack>})
        </VStack>)
}

export default ActionsComponent

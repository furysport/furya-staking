import {ArrowBackIcon} from "@chakra-ui/icons"
import {Box, Button, HStack, IconButton, Text, useDisclosure, VStack} from "@chakra-ui/react"
import {useRecoilState} from "recoil"
import {walletState, WalletStatusType} from "state/atoms/walletAtoms"
import Redelegate from "./Redelegate"
import Delegate, {TokenPriceBalance} from "./Delegate"
import {useRouter} from 'next/router'

import {delegationAtom, TokenItemState} from "state/atoms/delegationAtoms";
import React, { useMemo, useState} from "react";
import WalletModal from "../../Wallet/Modal/Modal";

import Loader from "../../Loader";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";
import {ActionType} from "components/Pages/Delegations/Dashboard";
import Undelegate from "components/Pages/Delegations/Undelegate";
import {useTokenList} from "hooks/useTokenList";
import {useMultipleTokenBalance} from "hooks/useTokenBalance";
import { useAllianceDelegate } from "./hooks/useDelegate"
import { useAllianceReDelegate } from "./hooks/useRedelegate"
import { useAllianceUnDelegate } from "./hooks/useUndelegate"

import { useTerraStation } from "../../../hooks/useTerraStation"
import { ConnectType, useConnectedWallet } from "@terra-money/wallet-provider"
import { TerraStationWallet } from "../../../util/wallet-adapters/terraStationWallet"
import { LCDClient } from '@terra-money/feather.js'

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

    const [{chainId, status, client },_] = useRecoilState(walletState)
    const connectedWallet = useConnectedWallet()
    // TODO: Improve this, maybe its fine as is 
    // It comes from useTerraStation, instead of importing it we just use what we need
    const mainnet = new LCDClient({
        'juno-1':{
          lcd: 'https://ww-juno-rest.polkachu.com',
          chainID: 'juno-1',
          gasAdjustment: 0.004,
          gasPrices: { ujuno: 0.0025 },
          prefix: 'juno',
        },
        'phoenix-1':{
          lcd: 'https://ww-terra-rest.polkachu.com',
          chainID: 'phoenix-1',
          gasAdjustment: 1.75,
          gasPrices: { uluna: 0.015 },
          prefix: 'terra',
        },
        'chihuahua-1':{
          lcd: 'https://ww-chihuahua-rest.polkachu.com',
          chainID: 'chihuahua-1',
          gasAdjustment: 5,
          gasPrices: { uhuahua: 1 },
          prefix: 'chihuahua',
        },
        'migaloo-1': {
          lcd: 'https://ww-migaloo-rest.polkachu.com/',
          chainID: 'migaloo-1',
          gasAdjustment: 0.1,
          gasPrices: { uwhale: 0.05 },
          prefix: 'migaloo',
        }
      })
    //   We need a connectedWallet and a LCDClient to create a TerraStationWallet, its an abstraction which has Keplr friendly function names BUT underneath is using Feather js and supports alliance 
    const tsWall =  new TerraStationWallet(
        connectedWallet,
        mainnet,
        'mainnet',
        'migaloo-1'
      )

    const isWalletConnected: boolean = status === WalletStatusType.connected
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const router = useRouter()

    const [currentDelegationState, setCurrentDelegationState] = useRecoilState<TokenItemState>(delegationAtom)

    const {tokenInfoList}  = useTokenList()
    const whalePrice = useWhalePrice()

    const {data: balances} = useMultipleTokenBalance(tokenInfoList?.map(e=>e.symbol) ?? [])

    const liquidTokenPriceBalances : TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index)=> ({
        price: whalePrice, balance:balances?.[index] , tokenSymbol: tokenInfo.symbol
    })) ?? []
    const delegatedTokenPriceBalances : TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index)=> ({
        price: whalePrice, balance:balances?.[index] , tokenSymbol: tokenInfo.symbol
    })) ?? []
    const rewardsTokenPriceBalances : TokenPriceBalance[] = tokenInfoList?.map((tokenInfo, index)=> ({
        price: whalePrice, balance:balances?.[index] , tokenSymbol: tokenInfo.symbol
    })) ?? []

    const txStep = TxStep.Idle

    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) return "Connect Wallet"
        else if (currentDelegationState?.amount === 0) return "Enter Amount"
        else return ActionType[globalAction]
    }, [isWalletConnected, currentDelegationState, globalAction])


    const [isLoadingSummary , setIsLoadingSummary]= useState<boolean>(false)


    const DelegationActionButton = ({action}) => {

        const actionString = ActionType[action].toString()

        const onClick = async () => {
            setCurrentDelegationState({...currentDelegationState, amount:0})
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
                        setCurrentDelegationState({...currentDelegationState, amount:0})
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
            </VStack>:
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
                        if(isWalletConnected){
                            //TODO: Fix this to be more dynamic and not hardcoded 

                            switch (globalAction) {
                                case ActionType.delegate:
                                    // Currently delegates to WindPowerStake an ampLuna
                                    useAllianceDelegate(tsWall, 'migaloo-1', 'migaloovaloper1esv20mwvedun93ysekdeyk3x5ckeqcnjdjql4w', 1, "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A")
                                    return 
                                case ActionType.redelegate:
                                    // Currently redelegates from WindPowerStake to Notional an ampLuna
                                    useAllianceReDelegate(tsWall, 'migaloo-1', 'migaloovaloper1esv20mwvedun93ysekdeyk3x5ckeqcnjdjql4w', 'migaloovaloper1rqvctgdpafvc0k9fx4ng8ckt94x723zmp3g0jv', 1, "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A")
                                    return 
                                case ActionType.undelegate:
                                    // Currently undelegates from WindPowerStake an ampLuna
                                    useAllianceUnDelegate(tsWall, 'migaloo-1', 'migaloovaloper1esv20mwvedun93ysekdeyk3x5ckeqcnjdjql4w', 1, "ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A")
                                    return 
                            }

                        }
                        else{
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

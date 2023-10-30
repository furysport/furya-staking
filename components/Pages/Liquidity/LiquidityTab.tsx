import {HStack, Text, VStack} from "@chakra-ui/react"
import CardComponent, {AssetType} from "components/Pages/CardComponent"
import AssetOverview, {TokenType} from "components/Pages/AssetOverview"
import RewardsComponent from "components/Pages/RewardsComponent"
import React from "react"
import CustomButton from "components/CustomButton"
import {useRouter} from "next/router"
import {useRecoilState} from "recoil";
import {delegationState} from "state/delegationState";

export const LiquidityTab = ({
                                 isWalletConnected,
                                 isLoading,
                                 address,
                                 updatedData,
                                 aprs,
                             }) => {
    const [currentDelegationState, setCurrentDelegationState] = useRecoilState(delegationState)

    const router = useRouter()
    const openDelegate = async () => {
        setCurrentDelegationState({...currentDelegationState,
            tokenSymbol: 'USDC-WHALE-LP',
        })
        await router.push('/liquidity/delegate')
    }

    const openUndelegate = async () => {
        setCurrentDelegationState({...currentDelegationState,
            tokenSymbol: 'USDC-WHALE-LP',
        })
        await router.push('/liquidity/undelegate')
    }

    return <VStack
        pt={12}
        maxW={1270}
        alignItems={'flex-start'}
        spacing={6}>
        <HStack width={"full"} justifyContent={"space-between"}>
            <Text as="h1"
                  fontSize="37"
                  fontWeight="700">
                Liquidity
            </Text>
            <HStack pr={2}>
                <CustomButton isTransparent={true}
                              onClick={()=>openDelegate()}
                              buttonLabel={"Delegate"}
                              height={"42px"}
                              width={"198px"}/>
                <CustomButton isTransparent={true}
                              onClick={()=>openUndelegate()}
                              buttonLabel={"Undelegate"}
                              height={"42px"}
                              width={"198px"}/>
            </HStack>
        </HStack>
        <HStack width="full" paddingY={5} spacing={10}>
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            assetType={AssetType.total}
            title={'Total Assets'}
            tokenData={updatedData?.total}
        />
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            title={'Liquid Assets'}
            tokenData={updatedData?.liquid}
        />
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            title={'Staked Assets'}
            tokenData={updatedData?.delegated}
        />
    </HStack>
        <HStack width="full" spacing={10}>
            <AssetOverview
                isLoading={isLoading}
                data={updatedData && updatedData?.delegated}
                isWalletConnected={isWalletConnected}
                aprs={aprs}
            />
            <RewardsComponent
                isWalletConnected={isWalletConnected}
                isLoading={isLoading}
                data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                address={address}
            />
        </HStack>
    </VStack>
}

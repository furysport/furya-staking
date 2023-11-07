import {HStack, Text, VStack} from "@chakra-ui/react"
import CardComponent, {AssetType} from "components/Pages/CardComponent"
import AssetOverview, {TokenType} from "components/Pages/AssetOverview"
import RewardsComponent from "components/Pages/RewardsComponent"
import React, {useEffect, useMemo, useState} from "react"
import CustomButton from "components/CustomButton"
import {useRouter} from "next/router"
import {useGetTotalStakedBalances} from "hooks/useGetTotalStakedBalances";
import {useGetVTRewardShares} from "hooks/useGetVTRewardShares";
import {useTotalYearlyWhaleEmission} from "hooks/useWhaleInfo";
import usePrices from "hooks/usePrices";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {getTokenPrice} from "util/getTokenPrice";

export const LiquidityTab = ({
                                 isWalletConnected,
                                 isLoading,
                                 address,
                                 updatedData,
                             }) => {
    const router = useRouter()
    const openDelegate = async () => await router.push('/liquidity/delegate?tokenSymbol=USDC-WHALE-LP')
    const openUndelegate = async () => await router.push('/liquidity/undelegate?tokenSymbol=USDC-WHALE-LP')

    const [aprs, setAprs] = useState([])
    const {data: totalStakedBalances} = useGetTotalStakedBalances()
    const {data: rewardDistribution} = useGetVTRewardShares()
    const {totalYearlyWhaleEmission} = useTotalYearlyWhaleEmission()
    const vtEmission = useMemo(() => 0.05 / 1.1 * totalYearlyWhaleEmission, [totalYearlyWhaleEmission])
    const [priceList] = usePrices() || []
    const { lpTokenPrice} = useGetLPTokenPrice()

    useEffect(() => {
        if (!totalStakedBalances || !rewardDistribution || !vtEmission || !priceList || !lpTokenPrice) {
            return
        }
        setAprs(rewardDistribution?.map((info) => {
            const stakedBalance = totalStakedBalances?.find((balance) => balance.denom === info.denom)
            const stakedTokenPrice = getTokenPrice(stakedBalance, priceList, lpTokenPrice)
            return {
                name: info.tokenSymbol,
                apr: (info.distribution * vtEmission * priceList['Whale'] / ((stakedBalance?.totalAmount || 0) * stakedTokenPrice)) * 100,
            }
        }))
    }, [totalStakedBalances, rewardDistribution, priceList, lpTokenPrice])

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
                              disabled={!isWalletConnected}
                              buttonLabel={"Delegate"}
                              height={"42px"}
                              width={"198px"}/>
                <CustomButton isTransparent={true}
                              onClick={()=>openUndelegate()}
                              disabled={!isWalletConnected}
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

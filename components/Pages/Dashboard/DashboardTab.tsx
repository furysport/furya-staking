import {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";
import {useGetTotalStakedBalances} from "hooks/useGetTotalStakedBalances";
import {useGetVTRewardShares} from "hooks/useGetVTRewardShares";
import {useTotalYearlyWhaleEmission} from "hooks/useWhaleInfo";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {getTokenPrice} from "util/getTokenPrice";
import {HStack, Text, VStack} from "@chakra-ui/react";
import AssetOverview, {TokenType} from "components/Pages/AssetOverview";

import {HStack, Text, VStack} from "@chakra-ui/react"
import AssetOverview, {TokenType} from "components/Pages/AssetOverview"
import React, {useEffect, useMemo, useState} from "react"
import {useRouter} from "next/router"
import {useGetTotalStakedBalances} from "hooks/useGetTotalStakedBalances";
import {useGetVTRewardShares} from "hooks/useGetVTRewardShares";
import {useTotalYearlyWhaleEmission} from "hooks/useWhaleInfo";
import usePrices from "hooks/usePrices";
import {useGetLPTokenPrice} from "hooks/useGetLPTokenPrice";
import {getTokenPrice} from "util/getTokenPrice";
import AssetTable from "components/Pages/Dashboard/AssetTable";

export const DashboardTab = ({
                                 isWalletConnected,
                                 isLoading,
                                 address,
                                 updatedData
                             }) => {
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
                Dashboard
            </Text>
        </HStack>
            <AssetOverview
                isLoading={isLoading}
                data={updatedData && updatedData?.delegated}
                isWalletConnected={isWalletConnected}
                aprs={aprs}
            />
        <AssetTable/>
    </VStack>
}

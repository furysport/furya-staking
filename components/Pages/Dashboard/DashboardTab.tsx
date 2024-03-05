import React, { useEffect, useState } from 'react';

import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import { useChain } from '@cosmos-kit/react-lite';
import { useCalculateAllianceAprs } from 'components/Pages/Alliance/hooks/useCalculateAllianceAprs';
import { Token } from 'components/Pages/AssetOverview';
import AssetTable, { DashboardData } from 'components/Pages/Dashboard/AssetTable';
import { DashboardPieChart } from 'components/Pages/Dashboard/DashboardPieChart';
import { FuryBtcLogo } from 'components/Pages/Dashboard/FuryBtcLogo';
import { useAssetsData } from 'components/Pages/Dashboard/hooks/useAssetsData';
import { USKFuryLogo } from 'components/Pages/Dashboard/USKFuryLogo';
import { Apr, useCalculateAprs } from 'components/Pages/Ecosystem/hooks/useCalculateAprs';
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices';
import useValidators from 'hooks/useValidators';
import tokens from 'public/mainnet/tokens.json';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

const dashboardTokenSymbols = [Token.FURY, Token.USK, Token.ampLUNA, Token.bLUNA, Token.ASH, Token['USK-FURY-LP'], Token['FURY-wBTC-LP'], Token.wBTC]
export const DashboardTab = ({ priceList }) => {
  const { walletChainName } = useRecoilValue(chainState)
  const { address } = useChain(walletChainName)
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([])
  const lpTokenPrices = useGetLPTokenPrices()
  const [initialized, setInitialized] = useState<boolean>(false)

  const { vtRewardShares, totalStakedBalances } = useAssetsData()

  const { data: { stakedAmpLuna, stakedBLuna, stakedFury, stakedWBtc } } = useValidators({ address })
  const [aprs, setAprs] = useState<Apr[]>([])
  const allianceAPRs = useCalculateAllianceAprs({ address })
  const otherAprs = useCalculateAprs()

  useEffect(() => {
    if (allianceAPRs?.length === 0 || otherAprs.length === 0 || !vtRewardShares) {
      return
    }
    const aprs = [...allianceAPRs, ...otherAprs].map((apr) => {
      const vtRewardShare = vtRewardShares.find((info) => info.tokenSymbol === apr.name)
      return {
        ...apr,
        weight: apr?.weight ?? ((vtRewardShare?.distribution || 0) * 0.05),
      }
    })
    setAprs(aprs)
  }, [vtRewardShares, allianceAPRs, otherAprs])

  useEffect(() => {
    if (!totalStakedBalances || !stakedAmpLuna || !stakedBLuna || !stakedFury || !stakedWBtc || !priceList || !lpTokenPrices || aprs.length === 0) {
      return
    }
    const dashboardData = dashboardTokenSymbols.map((symbol) => {
      const asset = tokens.find((token) => token.symbol === symbol)
      const totalStakedBalance = totalStakedBalances.find((balance) => balance.tokenSymbol === symbol)
      let totalAmount = 0
      switch (asset.symbol) {
        case Token.bLUNA:
          totalAmount = stakedBLuna
          break
        case Token.ampLUNA:
          totalAmount = stakedAmpLuna
          break
        case Token.FURY:
          totalAmount = stakedFury;
          break
        case Token.wBTC:
          totalAmount = stakedWBtc
          break
        default:
          totalAmount = totalStakedBalance?.totalAmount || 0
          break
      }
      const apr = aprs?.find((apr) => apr.name === symbol)
      return {
        logo: symbol === 'USK-FURY-LP' ? <USKFuryLogo/> : symbol === 'FURY-wBTC-LP' ? <FuryBtcLogo/> :
          <Image
            src={asset.logoURI}
            alt="logo-small"
            width="auto"
            maxW="1.5rem"
            maxH="1.5rem"
          />,
        symbol,
        category: asset.tabType,
        totalStaked: totalAmount,
        totalValueStaked: (symbol?.includes('-LP') ? lpTokenPrices?.[symbol] || 0 : symbol === Token.USK ? 1 : priceList[asset.name]) * totalAmount,
        rewardWeight: (apr?.weight || 0) * 100,
        apr: apr?.apr || 0,
      }
    })
    setDashboardData(dashboardData)
    setInitialized(true)
  }, [vtRewardShares, totalStakedBalances, stakedAmpLuna, stakedBLuna, stakedFury, stakedWBtc, priceList, lpTokenPrices, aprs])

  return <VStack
    pt={12}
    alignItems={'flex-start'}
    spacing={6}>
    <HStack width={'full'} justifyContent={'space-between'}>
      <Text as="h1"
        fontSize="37"
        fontWeight="700">
                Dashboard
      </Text>
    </HStack>
    <AssetTable dashboardData={dashboardData} initialized={initialized}/>
    <DashboardPieChart dashboardData={dashboardData}/>
  </VStack>
}

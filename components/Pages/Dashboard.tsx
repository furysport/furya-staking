import React, { useEffect, useMemo, useState } from 'react'

import { Box, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import { useChain } from '@cosmos-kit/react-lite';
import Header from 'components/Header/Header'
import Logo from 'components/Header/Logo'
import { AllianceTab } from 'components/Pages/Alliance/AllianceTab'
import { calculateAllianceData } from 'components/Pages/Alliance/hooks/calculateAllianceData'
import { useCalculateAllianceAprs } from 'components/Pages/Alliance/hooks/useCalculateAllianceAprs'
import { Token } from 'components/Pages/AssetOverview'
import { DashboardTab } from 'components/Pages/Dashboard/DashboardTab'
import { calculateEcosystemData } from 'components/Pages/Ecosystem/calculateEcosystemData'
import { EcosystemTab } from 'components/Pages/Ecosystem/EcosystemTab'
import { calculateLiquidityData } from 'components/Pages/Liquidity/calculateLiquidityData'
import { LiquidityTab } from 'components/Pages/Liquidity/LiquidityTab'
import { FURYA_CHAIN_NAME } from 'constants/common';
import useDelegations from 'hooks/useDelegations'
import { useGetLPTokenPrices } from 'hooks/useGetLPTokenPrices'
import usePrices from 'hooks/usePrices'
import { useQueryRewards } from 'hooks/useQueryRewards'
import { useQueryStakedBalances } from 'hooks/useQueryStakedBalances'
import { useMultipleTokenBalance } from 'hooks/useTokenBalance'
import useUndelegations from 'hooks/useUndelegations'
import whiteListedAllianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import whiteListedEcosystemTokens from 'public/mainnet/white_listed_ecosystem_token_info.json'
import whiteListedLiquidityTokens from 'public/mainnet/white_listed_liquidity_token_info.json'
import { useRecoilState } from 'recoil'
import { tabState, TabType } from 'state/tabState'

export interface Reward {
    amount: number;
    denom: string;
    dollarValue: number;
}

export enum ActionType {
    delegate,
    redelegate,
    undelegate,
    claim,
    updateRewards
}

export type TokenData = {
    color: string;
    value: number;
    dollarValue: number;
    token?: Token;
    tokenSymbol?: string;
};

export interface DelegationData {
    delegated: TokenData[];
    undelegated: TokenData[];
    liquid: TokenData[];
    rewards: any;
    total?: TokenData[];
}

const Dashboard = () => {
  const { address, isWalletConnected } = useChain(FURYA_CHAIN_NAME)

  const rawAllianceTokenData = useMemo(() => whiteListedAllianceTokens.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    color: t.color,
  })), [])

  const rawLiquidityTokenData = useMemo(() => whiteListedLiquidityTokens?.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    color: t.color,
  })), [])

  const rawEcosystemTokenData = useMemo(() => whiteListedEcosystemTokens.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    color: t.color,
  })), [])

  const allianceRewardsTokenData = useMemo(() => whiteListedAllianceTokens.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    totalRewardDollarValue: 0,
    rewards: [],
  })), [])

  const ecosystemRewardsTokenData = useMemo(() => whiteListedEcosystemTokens.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    totalRewardDollarValue: 0,
    rewards: [],
  })), [])

  const liquidityRewardsTokenData = useMemo(() => whiteListedLiquidityTokens.map((t) => ({
    token: Token[t.symbol],
    tokenSymbol: t.symbol,
    name: t.name,
    dollarValue: 0,
    value: 0,
    totalRewardDollarValue: 0,
    rewards: [],
  })), [])

  const [priceList] = usePrices() || []

  // TODO: useDelegations should return 1 list of delegations which includes both native staking and alliance staking entries for the given address
  const { data } = useDelegations({ address })

  const { data: stakedBalances } = useQueryStakedBalances()

  const delegations = useMemo(() => data?.delegations || [], [data])

  const { data: allianceBalances } = useMultipleTokenBalance(whiteListedAllianceTokens?.map((e) => e.symbol))
  const { data: ecosystemBalances } = useMultipleTokenBalance(whiteListedEcosystemTokens?.map((e) => e.symbol))
  const { data: liquidityBalances } = useMultipleTokenBalance(whiteListedLiquidityTokens?.map((e) => e.symbol))
  const { data: undelegationData } = useUndelegations({ address })

  const allianceAPRs = useCalculateAllianceAprs({ address })

  const undelegations = useMemo(() => undelegationData?.undelegations || [],
    [undelegationData])
  const [currentTab, setCurrentTab] = useRecoilState(tabState)

  const setTabType = (index: number) => {
    switch (index) {
      case 0:
        setCurrentTab(TabType.dashboard)
        break;
      case 1:
        setCurrentTab(TabType.alliance)
        break;
      case 2:
        setCurrentTab(TabType.ecosystem)
        break;
      case 3:
        setCurrentTab(TabType.liquidity)
        break
      default:
        throw new Error('Invalid tab index')
    }
  }
  const tabTypeToIndex = (tabType: TabType) => {
    switch (tabType) {
      case TabType.dashboard:
        return 0
      case TabType.alliance:
        return 1
      case TabType.ecosystem:
        return 2
      case TabType.liquidity:
        return 3
      default:
        throw new Error('Invalid tab type')
    }
  }

  const [updatedAllianceData, setAllianceData] = useState<DelegationData>({
    delegated: rawAllianceTokenData,
    undelegated: rawAllianceTokenData,
    liquid: rawAllianceTokenData,
    rewards: allianceRewardsTokenData,
    total: rawAllianceTokenData,
  })
  const [updatedEcosystemData, setEcosystemData] = useState({
    delegated: rawEcosystemTokenData,
    liquid: rawEcosystemTokenData,
    rewards: ecosystemRewardsTokenData,
    total: rawEcosystemTokenData,
  })

  const [updatedLiquidityData, setLiquidityData] = useState({
    delegated: rawLiquidityTokenData,
    liquid: rawLiquidityTokenData,
    rewards: liquidityRewardsTokenData,
    total: rawLiquidityTokenData,
  })

  const { data: rewards } = useQueryRewards()

  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    calculateAllianceData(
      rawAllianceTokenData, priceList, allianceBalances, delegations, undelegations, setAllianceData,
    )
  }, [allianceBalances, delegations, rawAllianceTokenData, undelegations, priceList])

  useEffect(() => {
    calculateEcosystemData(
      rawEcosystemTokenData, priceList, ecosystemBalances, stakedBalances, rewards, setEcosystemData,
    )
  }, [ecosystemBalances, stakedBalances, rewards, rawEcosystemTokenData, priceList])

  const lpTokenPrices = useGetLPTokenPrices()
  useEffect(() => {
    calculateLiquidityData(
      rawLiquidityTokenData, priceList, lpTokenPrices, liquidityBalances, stakedBalances, rewards, setLiquidityData,
    )
  }, [stakedBalances, rewards, liquidityBalances, rawLiquidityTokenData, priceList, lpTokenPrices])

  useEffect(() => {
    setLoading(updatedAllianceData === null ||
            !priceList)
  }, [updatedAllianceData, priceList])

  return (
    <VStack
      w="full"
      alignSelf="start"
      alignItems={'flex-start'}
      justifyContent={'center'}
      justify={'center'}>
      <Tabs variant={'brand'} index={tabTypeToIndex(currentTab)} onChange={(index) => setTabType(index)} mr={100}>
        <HStack justifyItems={'space-evenly'}>
          <Box flex="1">
            <Logo/>
          </Box>
          <TabList
            display={['flex']}
            flexWrap={['wrap']}
            justifyContent="flex-start"
            borderRadius={30}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            mt={0}>
            <Tab>Dashboard</Tab>
            <Tab>Alliance</Tab>
            <Tab>Ecosystem</Tab>
            <Tab>Liquidity</Tab>
          </TabList>
          <Header/>
        </HStack>
        <TabPanels p={4}>
          <TabPanel>
            <DashboardTab priceList={priceList}/>
          </TabPanel>
          <TabPanel>
            <AllianceTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address}
              updatedData={updatedAllianceData} allianceAPRs={allianceAPRs}/>
          </TabPanel>
          <TabPanel>
            <EcosystemTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address}
              updatedData={updatedEcosystemData}/>
          </TabPanel>
          <TabPanel>
            <LiquidityTab isWalletConnected={isWalletConnected} isLoading={isLoading} address={address}
              updatedData={updatedLiquidityData}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default Dashboard

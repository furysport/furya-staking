import React, { useEffect, useMemo, useState} from 'react';
import {HStack, Text, VStack} from '@chakra-ui/react';
import { useRecoilState} from 'recoil';
import {walletState, WalletStatusType} from 'state/atoms/walletAtoms';
import CardComponent from 'components/Pages/Delegations/CardComponent';
import AssetOverview, {Token, TokenType} from './AssetOverview';
import RewardsComponent from 'components/Pages/Delegations/RewardsComponent';
import Validators from 'components/Pages/Delegations/Validators';
import {useMultipleTokenBalance} from 'hooks/useTokenBalance';
import whiteListedTokens from 'public/mainnet/white_listed_token_info.json';
import useDelegations from 'hooks/useDelegations';
import {TOKENS_TO_EXCLUDE_BY_SYMBOL} from 'constants/staking';
import usePrice from 'hooks/usePrice';
import {useAlliances} from "hooks/useAlliances";
import {useTotalWhaleEmission} from "hooks/useMigaloo";
import {useWhalePrice} from "queries/useGetTokenDollarValueQuery";

export enum ActionType {
    delegate,
    redelegate,
    undelegate,
    claim,
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
    rewards: TokenData[];
}

const Dashboard = () => {
    const [{status, address}] = useRecoilState(walletState);
    const isWalletConnected: boolean = status === WalletStatusType.connected;

    const filteredTokens = useMemo(
        () => whiteListedTokens.filter((token) => !TOKENS_TO_EXCLUDE_BY_SYMBOL.includes(token.symbol)),
        []
    );

    const rawTokenData = useMemo(() => {
        return filteredTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, [filteredTokens]);

    const rewardsTokenData = useMemo(() => {
        return whiteListedTokens.map((t) => ({
            token: Token[t.symbol],
            tokenSymbol: t.symbol,
            name: t.name,
            dollarValue: 0,
            value: 0,
            color: t.color,
        }));
    }, []);

    const [priceList] = usePrice() || [];
    const {data, isLoading: isDelegationsLoading} = useDelegations({address});
    const delegations = useMemo(() => data?.delegations || [], [data]);
    const {data: balances } = useMultipleTokenBalance(filteredTokens.map((e) => e.symbol));

    const {alliances: allianceData} = useAlliances()
    const {totalWhaleEmission} = useTotalWhaleEmission()
    const price = useWhalePrice()
    const alliances = useMemo(() => allianceData?.alliances || [], [allianceData?.alliances]);

    const allianceAPRs = useMemo(() => {
        return alliances?.map(alliance => {
            return ({
                name: alliance.name,
                apr: !isNaN(alliance.totalDollarAmount) ? ((totalWhaleEmission * price * alliance.weight) / alliance.totalDollarAmount) * 100 : 0,
            })
        });
    }, [alliances, totalWhaleEmission, price]);


    const [updatedData, setData] = useState<DelegationData>({
        delegated: rawTokenData,
        undelegated: rawTokenData,
        liquid: rawTokenData,
        rewards: rewardsTokenData,
    });

    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Calculate data when dependencies change
        if (!priceList || !balances || !delegations) return;

        const liquidData = rawTokenData.map((token, index) => {
            const balance = balances?.[index] !== undefined ? balances?.[index] : 0;
            return {
                ...token,
                dollarValue: priceList && priceList[token.name] ? priceList[token.name] * balance : 0,
                value: balance,
            };
        });

        const calculateDelegationData = (tokenData: any, isRewards: boolean) => {
            const allDelegations = delegations.filter((d) => d.token.symbol === tokenData.tokenSymbol);
            const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + Number(isRewards ? e?.rewards.dollarValue ?? 0 : e?.token.dollarValue ?? 0), 0);
            const aggregatedAmount = allDelegations.reduce((acc, e) => acc + Number(isRewards ? e?.rewards?.amount ?? 0 : e?.token?.amount ?? 0), 0);

            return {
                ...tokenData,
                dollarValue: Number(aggregatedDollarValue),
                value: Number(aggregatedAmount),
            };
        };
        const calculateRewardData = (tokenData: any) => {

            const denom = whiteListedTokens.find(t=>t.symbol===tokenData.tokenSymbol).denom
            const allDelegations = delegations.filter((d) => d?.reward?.denom === denom);

            const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + Number(e?.reward.dollarValue ?? 0 ), 0);
            const aggregatedAmount = allDelegations.reduce((acc, e) => acc + Number(e?.reward?.amount ?? 0), 0);

            return {
                ...tokenData,
                dollarValue: Number(aggregatedDollarValue),
                value: Number(aggregatedAmount),
            };
        };

        const delegatedData = rawTokenData.map((tokenData) => calculateDelegationData(tokenData, false));

        const undelegatedData = rawTokenData.map((token, index) => ({
            ...token,
            dollarValue: 1,
            value: balances?.[index],
        }));

        const rewardsData = rewardsTokenData.map((tokenData) => calculateRewardData(tokenData));

        const delegationData: DelegationData = {
            delegated: delegatedData,
            undelegated: undelegatedData,
            liquid: liquidData,
            rewards: rewardsData,
        };

        setData(delegationData);

    }, [balances, delegations, rawTokenData, rewardsTokenData]);

    useEffect(() => {
        setLoading(balances === null || isDelegationsLoading || updatedData === null || !priceList);
    }, [balances, isDelegationsLoading, updatedData, priceList]);

    return (
        <VStack pt={12} minW={1270} alignSelf="center" alignItems={'flex-start'} spacing={6}>
            <Text fontSize={35} fontWeight={'bold'}>
                Dashboard
            </Text>
            <HStack width="full" paddingY={5} spacing={10}>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    isUndelegations={false}
                    title={'Balances'}
                    tokenData={updatedData?.liquid}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isUndelegations={false}
                    isLoading={isLoading}
                    title={'Delegations'}
                    tokenData={updatedData?.delegated}/>
                <CardComponent isWalletConnected={false} isUndelegations={true} isLoading={isLoading}
                               title={'Undelegations'} tokenData={updatedData?.undelegated}/>
            </HStack>
            <HStack width="full" spacing={10}>
                <AssetOverview
                    isLoading={isLoading}
                    data={updatedData && updatedData?.delegated}
                    isWalletConnected={isWalletConnected}
                    aprs={allianceAPRs}/>
                <RewardsComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                    address={address}/>
            </HStack>
            <Validators address={address}/>
        </VStack>
    )
}

export default Dashboard;
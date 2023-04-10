import React, {FC, useEffect, useMemo, useState} from 'react'

import {HStack, Text, VStack} from '@chakra-ui/react'

import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import CardComponent from "components/Pages/Delegations/CardComponent";
import AssetOverview, {Token, TokenType} from "./AssetOverview";
import RewardsComponent from "components/Pages/Delegations/RewardsComponent";
import Validators from "components/Pages/Delegations/Validators";
import {useMultipleTokenBalance} from "hooks/useTokenBalance";
import tokens from "public/mainnet/white_listed_token_info.json"
import useDelegations from "hooks/useDelegations";
import {TOKENS_TO_EXCLUDE_BY_SYMBOL} from "constants/staking";
import usePrice from "hooks/usePrice";

export enum ActionType {
    delegate, redelegate, undelegate, claim
}

export type TokenData = {
    color: string
    value: number
    dollarValue: number
    token?: Token
    tokenSymbol?: string

}

export interface DelegationData {
    delegated: TokenData[]
    undelegated: TokenData[]
    liquid: TokenData[]
    rewards: TokenData[]
}

const Dashboard: FC = () => {
    const [{status, address}] = useRecoilState(walletState)

    const isWalletConnected: boolean = status === WalletStatusType.connected

    const rawTokenData = useMemo(
        () =>
            tokens.filter(token => !TOKENS_TO_EXCLUDE_BY_SYMBOL.includes(token.symbol)).map((t, index) => {
                return {
                    token: Token[t.symbol],
                    tokenSymbol: t.symbol,
                    name: t.name,
                    dollarValue: null,
                    value: null,
                    color: t.color,
                };
            }),
        []
    );
    const [priceList] = usePrice() || []
    // data always gets new refernce
    const { data, isLoading: isDelegationsLoading } = useDelegations({ address });
    const delegations = useMemo(() => (data?.delegations || []), [data]);
    //const {} = useUndelegations({address})
    console.log("delegations")
    console.log(delegations)
    const {
        data: balances,
        isLoading: balancesLoading
    } = useMultipleTokenBalance(tokens.filter(token => !TOKENS_TO_EXCLUDE_BY_SYMBOL.includes(token.symbol)).map(e => e.symbol))
    const [updatedData, setData] = useState(null)

    useEffect(() => {
            const liquidData = rawTokenData.map((token, index) => {
                const balance = balances?.[index] !== undefined ? balances?.[index] : 0
                return ({
                    ...token,
                    dollarValue: priceList && priceList[token.tokenSymbol] ? priceList[token.name] * balance : 0,
                    value: balance
                })
            })

            const delegatedData = rawTokenData.map((tokenData, _) => {

                const allDelegations = delegations.filter(d => d.token.symbol === tokenData.tokenSymbol)
                const aggregatedDollarValue = allDelegations.reduce((acc, e) => acc + Number(e?.token.dollarValue ?? 0), 0);
                const aggregatedAmount = allDelegations.reduce((acc, e) => (acc + Number(e?.token?.amount ?? 0)), 0);
                return {
                    ...tokenData,
                    dollarValue: Number(aggregatedDollarValue),
                    value: Number(aggregatedAmount)
                }
            })

            const undelegatedData = rawTokenData.map((token, index) => ({
                ...token,
                dollarValue: 1,
                value: balances?.[index]
            }))
            const rewardsData = rawTokenData.map((tokenData, _) => {
                const allDelegations = delegations.filter(d => d.token.symbol === tokenData.tokenSymbol)
                const aggregatedDollarValue = allDelegations?.reduce((acc, e) => acc + Number(e?.rewards.dollarValue ?? 0), 0);
                const aggregatedAmount = allDelegations?.reduce((acc, e) => (acc + Number(e?.rewards?.amount ?? 0)), 0);

                return {
                    ...tokenData,
                    dollarValue: aggregatedDollarValue,
                    value: aggregatedAmount
                }
            })

            const delegationData: DelegationData = {
                delegated: delegatedData,
                undelegated: undelegatedData, liquid: liquidData, rewards: rewardsData
            }

            setData(delegationData)

    }, [balances, priceList, delegations])


    const [isLoading, setLoading] = useState<boolean>(true)


    useEffect(() => {

        setTimeout(() =>
                setLoading(balances === null || isDelegationsLoading || updatedData === null || !!!priceList)
            , 300)

    }, [balances, isDelegationsLoading, updatedData, priceList])


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
                    isLoading={isLoading}
                    isUndelegations={false}
                    title={"Balances"}
                    tokenData={updatedData?.liquid}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isUndelegations={false}
                    isLoading={isLoading}
                    title={"Delegations"}
                    tokenData={updatedData?.delegated}/>
                <CardComponent
                    isWalletConnected={false}
                    isUndelegations={true}
                    isLoading={isLoading}
                    title={"Undelegations"}
                    tokenData={updatedData?.undelegated}/>
            </HStack>
            <HStack
                width="full"
                spacing={10}>
                <AssetOverview
                    isLoading={isLoading}
                    data={updatedData && updatedData?.delegated}
                    isWalletConnected={isWalletConnected}/>
                <RewardsComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                    address={address}/>
            </HStack>
            <Validators address={address}/>
        </VStack>
    );
};

export default Dashboard

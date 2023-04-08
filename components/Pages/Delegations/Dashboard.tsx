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
                    dollarValue: null,
                    value: null,
                    color: t.color,
                };
            }),
        []
    );

    const [tokenData, setTokenData] = useState<TokenData[]>(rawTokenData)

    const {data: {delegations = []} = {}, isLoading: isDelegationsLoading} = useDelegations({address})
    //const {} = useUndelegations({address})
    const {data: balances, isLoading: balancesLoading} = useMultipleTokenBalance(tokens.map(e => e.symbol))

    const [updatedData, setData] = useState(null)

    useEffect(() => {
        const liquidData = tokenData.map((token, index) => ({
            ...token,
            dollarValue: 1,
            value: balances?.[index]
        }))

        const delegatedData = tokenData.map((tokenData, _) => {

            const allDelegations = delegations.filter(d => d.token.symbol === tokenData.tokenSymbol)
            const aggregatedDollarValue = allDelegations?.reduce((acc, e) => acc + Number(e?.token.dollarValue ?? 0), 0).toFixed(6);
            const aggregatedAmount = allDelegations?.reduce((acc, e) => (acc + Number(e?.token?.amount ?? 0)), 0).toFixed(6);

            return {
                ...tokenData,
                dollarValue: Number(aggregatedDollarValue),
                value: Number(aggregatedAmount)
            }
        })


        const undelegatedData = tokenData.map((token, index) => ({
            ...token,
            dollarValue: 1,
            value: balances?.[index]
        }))
        const rewardsData = tokenData.map((tokenData, _) => {
            const reward = delegations.find(d => d.token.symbol === tokenData.tokenSymbol)?.rewards
            return {
                ...tokenData,
                dollarValue: reward?.dollarValue ?? 0,
                value: reward?.amount ?? 0
            }
        })

        const delegationData: DelegationData = {
            delegated: delegatedData,
            undelegated: undelegatedData, liquid: liquidData, rewards: rewardsData
        }

        setData(delegationData)
    }, [delegations, balances])


    const [isLoading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        setLoading(balances === null && isDelegationsLoading)
    }, [balances, isDelegationsLoading])

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
                    title={"Balances"}
                    tokenData={updatedData?.liquid}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
                    isLoading={isLoading}
                    title={"Delegations"}
                    tokenData={updatedData?.delegated}/>
                <CardComponent
                    isWalletConnected={isWalletConnected}
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
                    isLoading={false}
                    data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                    address={address}/>
            </HStack>
            <Validators address={address}/>
        </VStack>
    );
};

export default Dashboard

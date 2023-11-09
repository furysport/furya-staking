import {useMemo} from 'react';
import {useQuery} from 'react-query';
import {useRecoilValue} from 'recoil';
import {convertMicroDenomToDenom} from 'util/conversion';

import {walletState, WalletStatusType} from 'state/walletState';
import {DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL} from 'util/constants';
import {Wallet} from '../util/wallet-adapters';
import {getTokenInfoFromTokenList} from './useTokenInfo';
import {CW20} from "services/cw20";
import {useAllTokenList} from "hooks/useAllTokenList";

async function fetchTokenBalance({
                                     client,
                                     token = {},
                                     address,
                                 }: {
    client: Wallet;
    token: any;
    address: string;
}) {
    const {denom, native, token_address, decimals} = token || {};

    if (!denom && !token_address) {
        return 0
    }

    if (native && !!client) {
        const coin = await client.getBalance(address, denom);
        const amount = coin ? Number(coin.amount) : 0;
        return convertMicroDenomToDenom(amount, decimals);
    }
    if (token_address) {
        try {
            const balance = await CW20(client, null).use(token_address).balance(address)
            return convertMicroDenomToDenom(Number(balance), decimals)
        } catch (err) {
            return 0
        }
    }
    return 0;
}

async function fetchTokenBalances({
                                      client,
                                      tokenSymbols,
                                      address,
                                      tokens
                                  }: {
    client: Wallet;
    tokenSymbols: Array<string>
    address: string;
    tokens: any
}) {
    return await Promise.all(
        tokenSymbols.map(async (symbol) => {
            const token = getTokenInfoFromTokenList(symbol, tokens)
            const balance = await fetchTokenBalance({
                client,
                token,
                address,
            })
            return balance || 0
        }),
    )
}

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
    const {address, status, client} =
        useRecoilValue(walletState)
    const {tokens} = useAllTokenList()
    const queryKey = useMemo(
        () => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
        [tokenSymbols],
    )

    const {data, isLoading} = useQuery(
        [queryKey, address, status],
        async () => {
            return await fetchTokenBalances({
                client,
                tokenSymbols,
                address,
                tokens
            })
        },
        {
            enabled: Boolean(
                status === WalletStatusType.connected &&
                tokenSymbols &&
                tokens &&
                !!address,
            ),

            refetchOnMount: 'always',
            refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
            refetchIntervalInBackground: true,
            onError(error) {
                console.error('Cannot fetch token balance bc:', error);
            },
        },
    )
    return {data, isLoading} as const;
}

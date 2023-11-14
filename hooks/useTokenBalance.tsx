import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useAllTokenList } from 'hooks/useAllTokenList';
import { useRecoilValue } from 'recoil';
import { CW20 } from 'services/cw20';
import { walletState, WalletStatusType } from 'state/walletState';
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants';
import { convertMicroDenomToDenom } from 'util/conversion';

import { Wallet } from '../util/wallet-adapters';
import { getTokenInfoFromTokenList } from './useTokenInfo';

const fetchTokenBalance = async ({
  client,
  token = {},
  address,
}: {
    client: Wallet;
    token: any;
    address: string;
}) => {
  const { denom, native, token_address, decimals } = token || {};

  if (!denom && !token_address) {
    return 0
  }

  if (native && client) {
    const coin = await client.getBalance(address, denom);
    const amount = coin ? Number(coin.amount) : 0;
    return convertMicroDenomToDenom(amount, decimals);
  }
  if (token_address) {
    try {
      const balance = await CW20(client, null).use(token_address).
        balance(address)
      return convertMicroDenomToDenom(Number(balance), decimals)
    } catch (err) {
      return 0
    }
  }
  return 0;
}

const fetchTokenBalances = async ({
  client,
  tokenSymbols,
  address,
  tokens,
}: {
    client: Wallet;
    tokenSymbols: Array<string>
    address: string;
    tokens: any
}) => await Promise.all(tokenSymbols.map(async (symbol) => {
  const token = getTokenInfoFromTokenList(symbol, tokens)
  const balance = await fetchTokenBalance({
    client,
    token,
    address,
  })
  return balance || 0
}))

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { address, status, client } =
        useRecoilValue(walletState)
  const { tokens } = useAllTokenList()
  const queryKey = useMemo(() => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
    [tokenSymbols])

  const { data, isLoading } = useQuery(
    [queryKey, address, status],
    async () => await fetchTokenBalances({
      client,
      tokenSymbols,
      address,
      tokens,
    }),
    {
      enabled: Boolean(status === WalletStatusType.connected &&
                tokenSymbols &&
                tokens &&
                address),

      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
      onError(error) {
        console.error('Cannot fetch token balance bc:', error);
      },
    },
  )
  return { data,
    isLoading } as const;
}

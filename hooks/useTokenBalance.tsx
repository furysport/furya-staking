import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { convertMicroDenomToDenom } from 'util/conversion';

import { walletState, WalletStatusType } from 'state/walletState';
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants';
import { Wallet } from '../util/wallet-adapters';
import { getTokenInfoFromTokenList } from './useTokenInfo';
import { useTokenList } from './useTokenList';
import { useConnectedWallet } from '@terra-money/wallet-provider';

async function fetchTokenBalance({
  client,
  token = {},
  address,
}: {
  client: Wallet;
  token: any;
  address: string;
}) {
  const { denom, native, token_address, decimals } = token || {};

  if (!denom && !token_address) {
    return 0
  }

  if (native && !!client) {
    const coin = await client.getBalance(address, denom);
    console.log("COINO", coin )
    const amount = coin ? Number(coin.amount) : 0;
    return convertMicroDenomToDenom(amount, decimals);
  }
  return 0;
}

export const useTokenBalance = (tokenSymbol: string) => {
  const { address, network, client, chainId } = useRecoilValue(walletState);
  const connectedWallet = useConnectedWallet();
  const selectedAddr = connectedWallet?.addresses[chainId] || address;

  const { tokens } = useTokenList();
  const tokenInfo = tokens?.filter((e) => e.symbol === tokenSymbol)[0];
  //const ibcAssetInfo = useIBCAssetInfo(tokenSymbol)
  const {
    data: balance = 0,
    isLoading,
    refetch,
  } = useQuery(
    ['tokenBalance', tokenSymbol, selectedAddr, network],
    async () => {
      // if (tokenSymbol && client && (tokenInfo || ibcAssetInfo)) {
      return await fetchTokenBalance({
        client,
        address,
        token: tokenInfo, // || ibcAssetInfo,
      });
      // }
    },
    {
      enabled: !!tokenSymbol && !!address && !!client && !!tokenInfo, //(!!tokenInfo || !!ibcAssetInfo),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  )

  return { balance, isLoading: isLoading, refetch };
};

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { address, status, client, chainId, network } =
    useRecoilValue(walletState);
  const { tokens } = useTokenList();
  //const [ibcAssetsList] = useIBCAssetList()
  const queryKey = useMemo(
    () => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
    [tokenSymbols],
  );

  const { data, isLoading } = useQuery(
    [queryKey, address, chainId, network],
    async () => {
      return await Promise.all(
        tokenSymbols
          // .filter(Boolean)
          .map((tokenSymbol) => {
            return fetchTokenBalance({
              client,
              address,
              token:
                getTokenInfoFromTokenList(tokenSymbol, tokens) ||
                {},
            });
          }),
      );
    },
    {
      enabled: Boolean(
        status === WalletStatusType.connected &&
          tokenSymbols?.length &&
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
  );

  return { data, isLoading } as const;
};

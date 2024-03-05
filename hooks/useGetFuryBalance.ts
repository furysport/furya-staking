import { useQuery } from 'react-query';

import { useChain } from '@cosmos-kit/react-lite';
import { FURYA_CHAIN_NAME } from 'constants/common';
import { useClients } from 'hooks/useClients';
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants';
import { convertMicroDenomToDenom } from 'util/conversion';

const fetchFuryBalance = async ({ client, address }) => {
  const coin = await client.getBalance(address, 'ufury')
  const amount = coin ? Number(coin.amount) : 0
  return convertMicroDenomToDenom(amount, 6)
}
export const useGetFuryBalance = () => {
  const { address } = useChain(FURYA_CHAIN_NAME)
  const { cosmWasmClient: client } = useClients()

  const {
    data: balance = 0,
    isLoading,
    refetch,
  } = useQuery(
    ['tokenBalance', address],
    async () => await fetchFuryBalance({
      client,
      address,
    }),
    {
      enabled: Boolean(address) && Boolean(client),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  )

  return { balance,
    isLoading,
    refetch }
}

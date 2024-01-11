import { useQuery } from 'react-query';

import { useChain } from '@cosmos-kit/react-lite';
import { MIGALOO_CHAIN_NAME } from 'constants/common';
import { useClients } from 'hooks/useClients';
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants';
import { convertMicroDenomToDenom } from 'util/conversion';

const fetchWhaleBalance = async ({ client, address }) => {
  const coin = await client.getBalance(address, 'uwhale')
  const amount = coin ? Number(coin.amount) : 0
  return convertMicroDenomToDenom(amount, 6)
}
export const useGetWhaleBalance = () => {
  const { address } = useChain(MIGALOO_CHAIN_NAME)
  const { cosmWasmClient: client } = useClients()

  const {
    data: balance = 0,
    isLoading,
    refetch,
  } = useQuery(
    ['tokenBalance', address],
    async () => await fetchWhaleBalance({
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

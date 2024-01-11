import { useQueries } from 'react-query'

import { useChain } from '@cosmos-kit/react-lite'
import { MIGALOO_CHAIN_NAME } from 'constants/common';

export const useClients = () => {
  const {
    getCosmWasmClient,
    getSigningCosmWasmClient,
    isWalletConnected,
    setDefaultSignOptions,
    wallet,
  } = useChain(MIGALOO_CHAIN_NAME)
  if (isWalletConnected && !wallet.name.includes('station')) {
    try {
      setDefaultSignOptions({
        preferNoSetFee: true,
        preferNoSetMemo: true,
        disableBalanceCheck: true,
      })
    } catch {
      console.error(`unable to set Default option for: ${wallet.name}`)
    }
  }
  const queries = useQueries([
    {
      queryKey: ['cosmWasmClient'],
      queryFn: async () => await getCosmWasmClient(),
    },
    {
      queryKey: ['signingClient'],
      queryFn: async () => await getSigningCosmWasmClient(),
      enabled: isWalletConnected,
    },
  ])

  // Check if both queries are in loading state
  const isLoading = queries.every((query) => query.isLoading)

  return {
    isLoading,
    cosmWasmClient: queries[0].data,
    signingClient: queries[1].data,
  }
}

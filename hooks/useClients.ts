import { useQueries } from 'react-query'

import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { useChain } from '@cosmos-kit/react-lite'
import { MsgClaimDelegationRewards } from 'components/Pages/Alliance/types/MsgClaimDelegationRewards';
import { MsgWithdrawDelegatorReward } from 'components/Pages/Alliance/types/MsgWithdrawDelegatorReward';
import { MIGALOO_CHAIN_NAME } from 'constants/common';
import { MsgDelegate, MsgUndelegate, MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const useClients = () => {
  const {
    getCosmWasmClient,
    getSigningCosmWasmClient,
    getOfflineSignerDirect,
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
    {
      queryKey: ['offlineSignerDirect'],
      queryFn: async () => {
        const offlineSigner = getOfflineSignerDirect()
        const stargateClient = await SigningStargateClient.connectWithSigner(
          'https://migaloo-rpc.polkachu.com:443', offlineSigner, { gasPrice: GasPrice.fromString('2uwhale') },
        )
        stargateClient.registry.register('/alliance.alliance.MsgDelegate', MsgDelegate)
        stargateClient.registry.register('/alliance.alliance.MsgUndelegate', MsgUndelegate)
        stargateClient.registry.register('/alliance.alliance.MsgRedelegate', MsgBeginRedelegate)
        stargateClient.registry.register('/alliance.alliance.MsgClaimDelegationRewards', MsgClaimDelegationRewards)
        stargateClient.registry.register('/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward', MsgWithdrawDelegatorReward)
        return stargateClient
      },
      enabled: isWalletConnected,
    },
  ])

  // Check if both queries are in loading state
  const isLoading = queries.every((query) => query.isLoading)

  return {
    isLoading,
    cosmWasmClient: queries[0].data,
    signingClient: queries[1].data,
    allianceSigningClient: queries[2].data,
  }
}

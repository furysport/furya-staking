import { useQuery } from 'react-query'

import { LCDClient } from '@terra-money/feather.js/dist/client/lcd/LCDClient';
import useClient from 'hooks/useClient';
import file from 'public/mainnet/contract_addresses.json'
import tokens from 'public/mainnet/tokens.json'

interface AssetDistributionResponse {
    asset: {
        cw20?: string;
        native?: string;
    }
    distribution: number
}

export interface AssetDistribution {
    denom: string
    tokenSymbol: string
    distribution: number
}
export const fetchVTRewardShares = async (client: LCDClient) => {
  if (!client) {
    return null
  }
  const msg = {
    reward_distribution: {},
  }
  const res: AssetDistributionResponse[] = await client.wasm.contractQuery(file.alliance_contract, msg)
  const vtRewardShares = res.map((info) => {
    const token = tokens.find((token) => token.denom === (info?.asset?.native ?? info?.asset?.cw20))
    return {
      denom: token.denom,
      tokenSymbol: token.symbol,
      distribution: info.distribution,
    } as AssetDistribution
  })
  return {
    vtRewardShares,
  }
}

export const useGetVTRewardShares = () => {
  const client = useClient()
  const { data, isLoading } = useQuery(
    ['vtRewardShares'],
    async () => await fetchVTRewardShares(client),
    {
      enabled: Boolean(client),
    },
  )
  return { ...data,
    isLoading }
}

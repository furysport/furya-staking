import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js/dist/client/lcd/LCDClient';
import useLCDClient from 'hooks/useLCDClient';
import usePrices from 'hooks/usePrices';
import { convertMicroDenomToDenom } from 'util/conversion';

interface Asset {
    amount: string;
    info: {
        native_token: {
            denom: string;
        }
    }
}

interface PoolInfo {
    assets: Asset[]
    total_share: number
}
export const fetchTotalPoolSuppliesAndCalculatePrice = async (client: LCDClient, furyPrice: number) => {
  if (!client) {
    return null
  }
  const furyUsdcPoolInfo : PoolInfo = await client.wasm.contractQuery('furya1xv4ql6t6r8zawlqn2tyxqsrvjpmjfm6kvdfvytaueqe3qvcwyr7shtx0hj', {
    pool: {},
  })

  const furyBtcPoolInfo : PoolInfo = await client.wasm.contractQuery('furya1axtz4y7jyvdkkrflknv9dcut94xr5k8m6wete4rdrw4fuptk896su44x2z', {
    pool: {},
  })

  const totalFuryUsdcDollarAmount = (furyUsdcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'ufury') {
      return convertMicroDenomToDenom(asset.amount, 6) * furyPrice
    } else {
      return convertMicroDenomToDenom(asset.amount, 6)
    }
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(furyUsdcPoolInfo.total_share, 6)

  const totalFuryBtcDollarAmount = (furyBtcPoolInfo?.assets.map((asset) => {
    if (asset.info.native_token.denom === 'ufury') {
      return convertMicroDenomToDenom(asset.amount, 6) * furyPrice * 2
    }
    return 0
  }).reduce((a, b) => a + b, 0) || 0) / convertMicroDenomToDenom(furyBtcPoolInfo.total_share, 6)

  return {
    'USK-FURY-LP': totalFuryUsdcDollarAmount,
    'FURY-wBTC-LP': totalFuryBtcDollarAmount,
  }
}

export const useGetLPTokenPrices = () => {
  const client = useLCDClient()
  const [priceList] = usePrices() || []
  const furyPrice = priceList?.Fury
  const { data: lpTokenPrices } = useQuery(
    ['getLPInfo', furyPrice],
    async () => await fetchTotalPoolSuppliesAndCalculatePrice(client, furyPrice), { enabled: Boolean(client) && Boolean(furyPrice) },
  )

  return lpTokenPrices
}

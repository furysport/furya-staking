import { LCDClient } from '@terra-money/feather.js'
import { num } from 'libs/num'
import tokens from 'public/mainnet/tokens.json'

type PoolInfo = {
  denom: string;
  decimals: number;
  contract: string;
  base?: boolean;
  basedOn?: string;
  chainId: string;
  name: string;
}

type TokenPrice = {
  [key: string]: number;
}

const getLCDClient = () => new LCDClient({
  'furya-1': {
    lcd: 'http://api.furya.xyz/',
    chainID: 'furya-1',
    gasAdjustment: 0.1,
    gasPrices: { ufury: 0.05 },
    prefix: 'furya',
  },
  'phoenix-1': {
    lcd: 'https://ww-terra-rest.polkachu.com/',
    chainID: 'phoenix-1',
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.015 },
    prefix: 'terra',
  },
})

const getPriceFromPool = ({ denom, decimals, contract, base, basedOn }: PoolInfo,
  basePrice?: TokenPrice): Promise<number> => {
  const client = getLCDClient()
  return client.wasm.
    contractQuery(contract, { pool: {} }).
    then((response: any) => {
      if (base) {
        const [asset1, asset2] = response?.assets || [];
        const isAB = asset1.info.native_token?.denom === denom;
        if (isAB) {
          return num(asset2.amount).div(asset1.amount).
            dp(decimals).
            toNumber()
        } else {
          return num(asset1.amount).div(asset2.amount).
            dp(decimals).
            toNumber()
        }
      } else {
        const [asset1, asset2] = response?.assets || [];
        const asset1Denom =
          asset1.info.native_token?.denom || asset1.info.token?.contract_addr
        const token1 = tokens.find((token) => token.denom === (asset1.info.native_token?.denom ?? asset1.info.token?.contract_addr))
        const token2 = tokens.find((token) => token.denom === (asset2.info.native_token?.denom ?? asset2.info.token?.contract_addr))
        const isAB = asset1Denom === 'ufury' || asset1Denom === 'uluna'
        if (!basePrice || !basedOn) {
          return 0
        }

        if (isAB) {
          return num(asset1.amount / (10 ** (token1?.decimals || 6))).
            div(asset2.amount / (10 ** (token2?.decimals || 6))).
            times(basePrice[basedOn]).
            dp((token2?.decimals || 6)).
            toNumber()
        } else {
          return num(asset2.amount / (10 ** (token2?.decimals || 6))).
            div(asset1.amount / (10 ** (token1?.decimals || 6))).
            times(basePrice[basedOn]).
            dp(decimals).
            toNumber()
        }
      }
    })
}

const getPrice = (tokens: PoolInfo[], basePrice?: TokenPrice) => {
  const promises = tokens.map((token) => getPriceFromPool(token, basePrice))
  return Promise.all(promises).then((prices) => {
    const tokenPrice: TokenPrice = {};
    tokens.forEach((token, index) => {
      tokenPrice[token.name] = prices[index]
    });
    return tokenPrice
  })
}

export const getTokenPrice = async (): Promise<[TokenPrice, number]> => {
  // Group by base tokens to make sure we get base price before other tokens
  const baseTokens = tokens.filter((token) => token.base);
  const otherTokens = tokens.filter((token) => !token.base);

  const basePrice = await getPrice(baseTokens);
  const otherPrice = await getPrice(otherTokens, basePrice);

  return [{ ...basePrice,
    ...otherPrice }, new Date().getTime()]
}

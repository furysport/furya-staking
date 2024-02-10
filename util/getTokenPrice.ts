import { Token } from 'components/Pages/AssetOverview';
import { TotalStakedBalance } from 'hooks/useGetTotalStakedBalances';

export const getTokenPrice = (
  stakedBalance: TotalStakedBalance, priceList, lpTokenPrices,
): number => (stakedBalance?.tokenSymbol === Token.mUSDC ? 1 : stakedBalance?.tokenSymbol.includes('-LP') ? lpTokenPrices?.[stakedBalance?.tokenSymbol] : priceList[stakedBalance?.name])

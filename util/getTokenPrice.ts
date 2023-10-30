import {TotalStakedBalance} from "hooks/useGetTotalStakedBalances";

export const getTokenPrice = (stakedBalance: TotalStakedBalance, priceList, lpTokenPrice): number => stakedBalance?.tokenSymbol === "mUSDC" ? 1 : stakedBalance?.tokenSymbol === "USDC-WHALE-LP" ? lpTokenPrice : priceList[stakedBalance?.name]

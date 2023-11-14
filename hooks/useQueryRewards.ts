import { useQuery } from 'react-query';

import file from 'public/mainnet/contract_addresses.json'
import tokens from 'public/mainnet/tokens.json';
import { useRecoilValue } from 'recoil';
import { TabType } from 'state/tabState';
import { walletState } from 'state/walletState';
import { convertMicroDenomToDenom } from 'util/conversion';
import { Wallet } from 'util/wallet-adapters/index'

interface Asset {
    native: string
    cw20: string
}

interface RawRewardInfo {
    reward_asset: Asset
    rewards: string
    staked_asset: Asset
}

export interface RewardInfo {
    tabType: TabType
    tokenSymbol: string
    name: string
    denom: string
    amount: number
    stakedDenom: string
}
const getRewards = async (
  contractAddress: string, address: string, client: Wallet,
): Promise<RewardInfo[]> => {
  const msg = {
    all_pending_rewards: {
      address,
    },
  }
  const rawRewards : RawRewardInfo[] = await client.queryContractSmart(contractAddress, msg)
  return rawRewards.map((info) => {
    const stakedToken = tokens?.find((token) => token.denom === (info?.staked_asset?.native ?? info?.staked_asset?.cw20))
    const rewardToken = tokens?.find((token) => token.denom === (info?.reward_asset?.native ?? info?.reward_asset?.cw20))

    return {
      tabType: stakedToken.tabType as TabType,
      tokenSymbol: rewardToken?.symbol,
      name: rewardToken?.name,
      denom: rewardToken?.denom,
      amount: convertMicroDenomToDenom(info?.rewards, 6),
      stakedDenom: stakedToken?.denom,
    }
  })
}
export const useQueryRewards = () => {
  const { client, address } = useRecoilValue(walletState)
  const { data, isLoading } = useQuery({
    queryKey: ['rewards', file.alliance_contract, address],
    queryFn: () => getRewards(
      file.alliance_contract, address, client,
    ),
    refetchInterval: 15000,
    enabled: Boolean(file.alliance_contract) && Boolean(client) && Boolean(address),
  })
  return { data,
    isLoading }
}

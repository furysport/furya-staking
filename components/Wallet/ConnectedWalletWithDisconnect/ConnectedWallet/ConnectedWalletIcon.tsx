import React from 'react'

import { useChain } from '@cosmos-kit/react-lite'
import KeplrWalletIcon from 'components/icons/KeplrWalletIcon';
import TerraExtensionIcon from 'components/icons/TerraExtensionIcon';
import { useRecoilValue } from 'recoil'
import { chainState } from 'state/chainState'

export enum WalletType {
  keplrExtension = 'keplr-extension',
  keplrMobile = 'keplr-mobile',
  terraExtension = 'station-extension',
}

export const ConnectedWalletIcon = () => {
  const { walletChainName } = useRecoilValue(chainState)
  const { wallet } = useChain(walletChainName)
  switch (wallet?.name) {
    case WalletType.keplrExtension || WalletType.keplrMobile:
      return <KeplrWalletIcon />
    case WalletType.terraExtension:
      return <TerraExtensionIcon />
    default:
      return <></>
  }
}


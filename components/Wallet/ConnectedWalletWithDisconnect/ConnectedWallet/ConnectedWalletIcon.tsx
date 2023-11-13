import React from 'react';

import CosmostationWalletIcon from 'components/icons/CosmostationWalletIcon';
import KeplrWalletIcon from 'components/icons/KeplrWalletIcon';
import LeapWalletIcon from 'components/icons/LeapWalletIcon';
import TerraExtensionIcon from 'components/icons/TerraExtensionIcon';
import { useRecoilValue } from 'recoil';
import { walletState } from 'state/walletState';

function ConnectedWalletIcon() {
  const { activeWallet } =
    useRecoilValue(walletState)
  switch (activeWallet) {
    case 'keplr':
      return <KeplrWalletIcon />;
    case 'leap':
      return <LeapWalletIcon />;
    case 'cosmostation':
      return <CosmostationWalletIcon />;
    case 'station':
      return <TerraExtensionIcon />;
    default:
      return <></>;
  }
}

export default ConnectedWalletIcon;

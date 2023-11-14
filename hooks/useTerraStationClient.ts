import { useMemo } from 'react';

import { LCDClient } from '@terra-money/feather.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { TerraStationWallet } from 'util/wallet-adapters/terraStationWallet';
export const useClient = () => {
  const connectedWallet = useConnectedWallet();

  const lcdClient = useMemo(() => new LCDClient({
    'migaloo-1': {
      lcd: 'https://ww-migaloo-rest.polkachu.com/',
      chainID: 'migaloo-1',
      gasAdjustment: 1.75,
      gasPrices: { uwhale: 0.25 },
      prefix: 'migaloo',
    },
  }), []);

  return useMemo(() => new TerraStationWallet(
    connectedWallet,
    lcdClient,
    'mainnet',
    'migaloo-1',
  ), [lcdClient, connectedWallet]);
};

export default useClient;

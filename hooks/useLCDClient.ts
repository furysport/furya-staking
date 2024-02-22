import { useMemo } from 'react';

import { LCDClient } from '@terra-money/feather.js';
const useLCDClient = () => useMemo(() => new LCDClient({
  'migaloo-1': {
    lcd: 'https://migaloo-api.polkachu.com:443',
    chainID: 'migaloo-1',
    gasAdjustment: 1.75,
    gasPrices: { uwhale: 1 },
    prefix: 'migaloo',
  },
}), []);

export default useLCDClient;

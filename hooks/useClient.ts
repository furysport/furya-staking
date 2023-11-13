import { useMemo } from 'react';

import { LCDClient } from '@terra-money/feather.js';
const useClient = () => useMemo(() => new LCDClient({
  'migaloo-1': {
    lcd: 'https://migaloo-api.polkachu.com',
    chainID: 'migaloo-1',
    gasAdjustment: 1.75,
    gasPrices: { uwhale: 0.25 },
    prefix: 'migaloo',
  },
}), []);

export default useClient;

import { useMemo } from 'react';

import { LCDClient } from '@terra-money/feather.js';
const useLCDClient = () => useMemo(() => new LCDClient({
  'furya-1': {
    lcd: 'https://api.furya.xyz:443',
    chainID: 'furya-1',
    gasAdjustment: 1.75,
    gasPrices: { ufury: 1 },
    prefix: 'furya',
  },
}), []);

export default useLCDClient;

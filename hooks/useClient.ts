import { LCDClient } from '@terra-money/feather.js';
import { useMemo } from 'react';
const useClient = () => {

  return useMemo(() => {
    return new LCDClient({
      'migaloo-1': {
        lcd: 'https://ww-migaloo-rest.polkachu.com/',
        chainID: 'migaloo-1',
        gasAdjustment: 0.1,
        gasPrices: { uwhale: 0.05 },
        prefix: 'migaloo',
      }
    });
  }, [])

}

export default useClient

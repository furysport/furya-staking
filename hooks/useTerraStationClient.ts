import { LCDClient } from '@terra-money/feather.js';
import { useMemo } from 'react';
import {TerraStationWallet} from "util/wallet-adapters/terraStationWallet";
import {useConnectedWallet} from "@terra-money/wallet-provider";
const useClient = () => {
    const connectedWallet = useConnectedWallet()

    const lcdClient = useMemo(() => {
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

    return useMemo(() => { return new TerraStationWallet(
        connectedWallet,
        lcdClient,
        'mainnet',
        'migaloo-1'
    );
    }, [])
}

export default useClient

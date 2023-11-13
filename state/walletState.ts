import { Key } from '@keplr-wallet/types';
import { atom } from 'recoil';
import { Wallet } from 'util/wallet-adapters/index';

export type Network = 'testnet' | 'mainnet';

export enum WalletStatusType {
  /* Nothing happens to the wallet */
  idle = '@wallet-state/idle',
  /* Restored wallets state from the cache */
  restored = '@wallet-state/restored',
  /* The wallet is fully connected */
  connected = '@wallet-state/connected',
  /* The wallet is fully connected */
  disconnected = '@wallet-state/disconnected',
  /* Connecting to the wallet */
  connecting = '@wallet-state/connecting',
  /* Error when tried to connect */
  error = '@wallet-state/error',
}

type GeneratedWalletState<
  TClient,
  TStateExtension extends NonNullable<unknown>,
> = TStateExtension & {
  client: TClient | null;
  status: WalletStatusType;
  address: string;
  chainId: string;
  network: Network;
  activeWallet: string;
};

type CreateWalletStateArgs<TState = NonNullable<unknown>> = {
  key: string;
  default: TState;
};

function createWalletState<TClient = any, TState = {}>({
  key,
  default: defaultState,
}: CreateWalletStateArgs<TState>) {
  return atom<GeneratedWalletState<TClient, TState>>({
    key,
    default: {
      status: WalletStatusType.idle,
      client: null,
      chainId: 'migaloo-1',
      address: '',
      network: 'mainnet',
      activeWallet: '',
      ...defaultState,
    },
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [
      ({ onSet, setSelf }) => {
        const CACHE_KEY = `@wasmswap/wallet-state/wallet-type-${key}`;
        const savedValue = localStorage.getItem(CACHE_KEY)
        if (savedValue) {
          try {
            const parsedSavedState = JSON.parse(savedValue)
            if (parsedSavedState?.address) {
              setSelf({
                ...parsedSavedState,
                status: WalletStatusType.restored,
              });
            }
          } catch (e) { /* Empty */ }
        }

        onSet((newValue, oldValue) => {
          localStorage.setItem(CACHE_KEY,
            /* Let's not store the client in the cache */
            JSON.stringify({ ...newValue,
              client: null,
              address: newValue?.address ?? oldValue?.address }))
        });
      },
    ],
  });
}

export const walletState = createWalletState<Wallet, { key?: Key }>({
  key: 'internal-wallet',
  default: {
    key: null,
  },
});

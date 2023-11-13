import React, { useState, useEffect } from 'react';

import { Box, Button, Divider } from '@chakra-ui/react';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import Card from 'components/Card';
import WalletIcon from 'components/icons/WalletIcon';
import ChainSelectWithBalance from 'components/Wallet/ChainSelectWithBalance/ChainSelectWithBalance';
import ConnectedWalletWithDisconnect from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWalletWithDisconnect';
import WalletModal from 'components/Wallet/Modal/WalletModal';
import { useTerraStation } from 'hooks/useTerraStation';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { tabState, TabType } from 'state/tabState';
import { walletState } from 'state/walletState';

const Wallet: any = ({
  connected,
  onDisconnect,
  onOpenModal,
  isOpenModal,
  onCloseModal,
}) => {
  const [isInitialized, setInitialized] = useState(false);
  const [currentWalletState, setCurrentWalletState] =
    useRecoilState(walletState)
  const [tabType, setTabType] = useRecoilState(tabState)

  const router = useRouter();

  const connectedWallet = useConnectedWallet();

  const { connectTerraAndCloseModal, filterForStation } = useTerraStation(() => {});
  const { availableConnections } = useWallet();

  useEffect(() => {
    if (router.pathname === '/') {
      return
    }

    if (tabType === TabType.dashboard) {
      const { pathname } = router
      if (pathname.includes('alliance')) {
        setTabType(TabType.alliance)
      } else if (pathname.includes('ecosystem')) {
        setTabType(TabType.ecosystem)
      } else if (pathname.includes('liquidity')) {
        setTabType(TabType.liquidity)
      }
    }

    const defaultChainId =
      currentWalletState.network === 'mainnet' ? 'migaloo-1' : 'narwhal-1';

    setCurrentWalletState({
      ...currentWalletState,
      chainId: defaultChainId,
    });
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (!currentWalletState.chainId) {
      return;
    }
    if (currentWalletState.activeWallet === 'station') {
      const [{ type = null, identifier = null } = {}] =
        availableConnections.filter(filterForStation);
      if (type && identifier) {
        connectTerraAndCloseModal(type, identifier);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWalletState.chainId, isInitialized, availableConnections]);

  if (!connected && !connectedWallet) {
    return (
      <>
        <Button
          variant="outline"
          display="flex"
          gap="3"
          color="white"
          border={'1px solid rgba(255, 255, 255, 0.5)'}
          borderRadius="full"
          onClick={onOpenModal}
        >
          <WalletIcon />
          Connect wallet
        </Button>
        <WalletModal
          isOpenModal={isOpenModal}
          onCloseModal={onCloseModal}
          chainId={currentWalletState.chainId}
        />
      </>
    );
  }

  return (
    <>
      <Card paddingY={[0, 1]} paddingX={[2, 6]} gap={4}>
        <ChainSelectWithBalance />
        <Box display={{ base: 'none',
          md: 'block' }}>
          <Divider
            orientation="vertical"
            borderColor="rgba(255, 255, 255, 0.1);"
          />
        </Box>
        <ConnectedWalletWithDisconnect
          connected={connected}
          onDisconnect={onDisconnect}
        />
      </Card>
    </>
  )
}

export default Wallet

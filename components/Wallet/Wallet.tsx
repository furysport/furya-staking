import React, { useState, useEffect } from 'react';

import { Box, Button, Divider } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import Card from 'components/Card';
import WalletIcon from 'components/icons/WalletIcon';
import { ChainSelectWithBalance } from 'components/Wallet/ChainSelectWithBalance/ChainSelectWithBalance';
import {
  ConnectedWalletWithDisconnect,
} from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWalletWithDisconnect';
import { MIGALOO_CHAIN_NAME } from 'constants/common';
import { useRouter } from 'next/router';
import { queryClient } from 'services/queryClient';

const Wallet: any = () => {
  const [isInitialized, setInitialized] = useState(false);
  const { openView, disconnect, isWalletConnected } = useChain(MIGALOO_CHAIN_NAME);

  const router = useRouter();
  const resetWallet = async () => {
    await disconnect()
    queryClient.clear()
  }

  useEffect(() => {
    if (router.pathname === '/') {
      return;
    }
    setInitialized(true);
  }, []);

  if (!isWalletConnected) {
    return (
      <>
        <Button
          variant="outline"
          display="flex"
          gap="3"
          color="white"
          border={'1px solid rgba(255, 255, 255, 0.5)'}
          borderRadius="full"
          onClick={openView}
        >
          <WalletIcon />
          Connect wallet
        </Button>
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
          onDisconnect={resetWallet}
        />
      </Card>
    </>
  )
}

export default Wallet

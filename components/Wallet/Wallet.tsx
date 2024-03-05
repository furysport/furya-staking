import React from 'react';

import { Box, Button, Divider } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import Card from 'components/Card';
import WalletIcon from 'components/icons/WalletIcon';
import { ChainSelectWithBalance } from 'components/Wallet/ChainSelectWithBalance/ChainSelectWithBalance';
import {
  ConnectedWalletWithDisconnect,
} from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWalletWithDisconnect';
import { FURYA_CHAIN_NAME } from 'constants/common';
import { queryClient } from 'services/queryClient';

const Wallet: any = () => {
  const { openView, disconnect, isWalletConnected } = useChain(FURYA_CHAIN_NAME);

  const resetWallet = async () => {
    await disconnect()
    queryClient.clear()
  }

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

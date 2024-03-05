import React from 'react';

import { Box, Flex, HStack } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react-lite';
import { FURYA_CHAIN_NAME } from 'constants/common';

import Wallet from '../Wallet/Wallet';

const Header = () => {
  const { disconnect, isWalletConnected } = useChain(FURYA_CHAIN_NAME)

  const resetWalletConnection = async () => {
    await disconnect()
  };

  return (
    <Box py={{ base: '4',
      md: '10' }} px={{ base: '4',
      md: '10' }}>
      <Flex
        justifyContent="space-between"
        mx="auto"
        maxWidth="container.xl"
        display={{ base: 'none',
          md: 'flex' }}
        alignItems="center"
      >
        <HStack flex="1" spacing="6" justify="flex-end">
          <Wallet
            connected={isWalletConnected}
            onDisconnect={resetWalletConnection}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;

import React from 'react';

import { Box, Flex, HStack, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@terra-money/wallet-provider';
import { useRecoilState } from 'recoil';
import { walletState, WalletStatusType } from 'state/walletState';

import Wallet from '../Wallet/Wallet';

const Header = () => {
  const { disconnect } = useWallet()
  const [{ key, status, chainId, network }, setWalletState] =
    useRecoilState(walletState)
  const isWalletConnected = status === WalletStatusType.connected
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const resetWalletConnection = () => {
    setWalletState({
      status: WalletStatusType.idle,
      address: '',
      client: null,
      network,
      chainId,
      activeWallet: null,
    })
    disconnect()
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
            walletName={key?.name}
            onDisconnect={resetWalletConnection}
            disconnect={disconnect}
            isOpenModal={isOpenModal}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
            onPrimaryButton={true}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;

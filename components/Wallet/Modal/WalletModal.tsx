import React from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { TerraStationConnectButton } from 'components/Wallet/Modal/TerraStationConnectButton'

export const WalletModal = ({ isOpenModal, onCloseModal, chainId }) => (
  <Modal isOpen={isOpenModal} onClose={onCloseModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Select Wallet</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack justify="center" align="center" textAlign="center">
          {chainId !== 'comdex-1' && chainId !== 'injective-1' && (
            <TerraStationConnectButton onCloseModal={onCloseModal} />
          )}
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default React.memo(WalletModal);

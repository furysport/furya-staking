import React from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

export const MobileNotSupportedModal = () => (
  <Modal isOpen={true} onClose={null} isCentered>
    <ModalOverlay />
    <ModalContent border="1px" borderColor="gray.200" padding="1" margin="4">
      <ModalHeader>
        <Text>Mobile not yet supported</Text>
      </ModalHeader>
    </ModalContent>
  </Modal>
)

export default React.memo(MobileNotSupportedModal);

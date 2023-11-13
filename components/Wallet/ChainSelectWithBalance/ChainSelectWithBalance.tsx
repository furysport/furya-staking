import React from 'react';

import { HStack, Text } from '@chakra-ui/react';
import DisplayBalance from 'components/Wallet/ChainSelectWithBalance/DisplayBalance';

export const ChainSelectWithBalance = () => (
  <HStack spacing="3">
    <DisplayBalance />
    <Text fontWeight={'bold'}>WHALE</Text>
  </HStack>
)

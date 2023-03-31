import React from 'react'

import { HStack } from '@chakra-ui/react'
import DisplayBalance from 'components/Wallet/ChainSelectWithBalance/DisplayBalance'

function ChainSelectWithBalance({
  connected,
  denom,
  onChainChange,
  currentWalletState,
}) {
  return (
    <HStack spacing="4">
      <DisplayBalance />
    </HStack>
  )
}

export default ChainSelectWithBalance

import React from 'react'

import { Text } from '@chakra-ui/react'
import { useChain } from '@cosmos-kit/react-lite'
import { FURYA_CHAIN_NAME } from 'constants/common'
import { truncate } from 'util/truncate'

export const TruncatedAddress = () => {
  const { address } = useChain(FURYA_CHAIN_NAME)

  const truncatedWalletAddress = (addr: string) => {
    const chainName = addr?.substring(0, addr.indexOf('1'))
    return `${chainName}${truncate(address, [0, 4])}`
  }

  return (
    <Text color="brand.500" fontSize={['14px', '16px']}>
      {truncatedWalletAddress(address)}
    </Text>
  )
}

export default TruncatedAddress

import React from 'react'

import { Spinner, Text } from '@chakra-ui/react'
import { useGetFuryBalance } from 'hooks/useGetFuryBalance'

const DisplayBalance = () => {
  const { balance, isLoading } = useGetFuryBalance()

  return (
    <>
      {isLoading ? (
        <Spinner color="white" size="xs" />
      ) : (
        <Text fontSize="16px" fontWeight="bold" display={['none', 'flex']}>
          {balance?.toFixed(1)}
        </Text>
      )}
    </>
  )
}

export default DisplayBalance

// eslint-disable-next-line sort-imports
import React, { useState, useEffect, useMemo } from 'react'

import { Box, Button, Divider } from '@chakra-ui/react'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider'
import Card from 'components/Card'
import WalletIcon from 'components/icons/WalletIcon'
import ChainSelectWithBalance from 'components/Wallet/ChainSelectWithBalance/ChainSelectWithBalance'
import ConnectedWalletWithDisconnect from 'components/Wallet/ConnectedWalletWithDisconnect/ConnectedWalletWithDisconnect'
import { useChainInfo} from 'hooks/useChainInfo'
import useConnectCosmostation from 'hooks/useConnectCosmostation'
import useConnectKeplr from 'hooks/useConnectKeplr'
import useConnectLeap from 'hooks/useConnectLeap'
import { useTerraStation } from 'hooks/useTerraStation'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { walletState } from 'state/atoms/walletAtoms'
import WalletModal from "components/Wallet/Modal/Modal";
//import { validChains } from 'util/chain'
//import { getPathName } from 'util/route'

const Wallet: any = ({ connected, onDisconnect, onOpenModal, isOpenModal ,onCloseModal}) => {
  const [isInitialized, setInitialized] = useState(false)
  const [currentWalletState, setCurrentWalletState] =
    useRecoilState(walletState)

  const router = useRouter()

  const connectedWallet = useConnectedWallet()
  const [chainInfo] = useChainInfo(currentWalletState.chainId)

  const { connectKeplr } = useConnectKeplr()
  const { connectLeap } = useConnectLeap()
  const { connectCosmostation } = useConnectCosmostation()
  const { connectTerraAndCloseModal, filterForStation } = useTerraStation(
    () => {}
  )
  const { availableConnections} = useWallet()

  useEffect(() => {
    // onDisconnect()

    if (router.pathname === '/') return

    const defaultChainId =
      currentWalletState.network === 'mainnet' ? 'migaloo-1' : 'narwhal-1'

    // if (
    //   validChains[currentWalletState.network][chainIdParam] !==
    //   currentWalletState.chainId
    // ) {
    //   setCurrentWalletState({
    //     ...currentWalletState,
    //     chainId: validChains[currentWalletState.network][chainIdParam],
    //   })
    // }

      setCurrentWalletState({
        ...currentWalletState,
        chainId: defaultChainId,
      })
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (router.pathname === '/') return

  //   const defaultChain =
  //     currentWalletState.network === 'mainnet'
  //       ? chains.find((row) => row.chainId === 'juno-1')
  //       : chains.find((row) => row.chainId === 'uni-3')
  //   const targetChain = chains.find(
  //     (row) => row.label.toLowerCase() === chainIdParam
  //   )
  //   if (targetChain && targetChain.chainId !== currentWalletState.chainId) {
  //     setCurrentWalletState({
  //       ...currentWalletState,
  //       chainId: targetChain.chainId,
  //     })
  //   }
  //   if (chains && chains.length > 0 && !targetChain) {
  //     setCurrentWalletState({
  //       ...currentWalletState,
  //       chainId: defaultChain.chainId,
  //     })
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chainIdParam, chains])

  const denom = useMemo(() => {
    if (!chainInfo) return
    const [coinDenom] = (chainInfo as any)?.currencies || []
    return coinDenom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chainInfo,
    currentWalletState.chainId,
    currentWalletState.network,
    currentWalletState.activeWallet,
    currentWalletState.address,
  ])

  const onChainChange = (chain) => {
    // onDisconnect()
    setCurrentWalletState({ ...currentWalletState, chainId: chain.chainId })
  }

  useEffect(() => {
    if (!isInitialized) return
    if (!currentWalletState.chainId) return

    if (currentWalletState.activeWallet === 'leap') {
      connectLeap()
    } else if (currentWalletState.activeWallet === 'keplr') {
      connectKeplr()
    } else if (currentWalletState.activeWallet === 'cosmostation') {
      connectCosmostation()
    } else if (currentWalletState.activeWallet === 'station') {
      const [{ type = null, identifier = null } = {}] =
        availableConnections.filter(filterForStation)
      if (type && identifier) connectTerraAndCloseModal(type, identifier)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWalletState.chainId, isInitialized, availableConnections])

  if (!connected && !connectedWallet) {
    return (
      <>
        <Button
          variant="outline"
          display="flex"
          gap="3"
          color="white"
          borderColor="whiteAlpha.400"
          borderRadius="full"
          onClick={onOpenModal}
        >
          <WalletIcon />
          Connect wallet
        </Button>
        <WalletModal
            isOpenModal={isOpenModal}
            onCloseModal={onCloseModal}
            chainId={currentWalletState.chainId}
        />
      </>
    )
  }

  return (
    <>
      <Card paddingY={[0, 1]} paddingX={[2, 6]} gap={4}>
        <ChainSelectWithBalance
          connected={connected}
          denom={denom}
          onChainChange={onChainChange}
          currentWalletState={currentWalletState}
        />
        <Box display={{ base: 'none', md: 'block' }}>
          <Divider
            orientation="vertical"
            borderColor="rgba(255, 255, 255, 0.1);"
          />
        </Box>
        <ConnectedWalletWithDisconnect
          connected={connected}
          onDisconnect={onDisconnect}
        />
      </Card>
    </>
  )
}

export default Wallet

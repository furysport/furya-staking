import React from 'react'

import {
    Box,
    Flex,
    HStack,
    useDisclosure,
} from '@chakra-ui/react'
import { useWallet } from '@terra-money/wallet-provider'
import { useChains } from 'hooks/useChainInfo'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'

import WalletModal from '../Wallet/Modal/Modal'
import Wallet from '../Wallet/Wallet'
import Logo from './Logo'

const Header = ({ }) => {
    const { disconnect } = useWallet()
    const [{ key, chainId, network }, setWalletState] = useRecoilState(walletState)

    //const chains: Array<any> = useChains()
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const resetWalletConnection = () => {
        setWalletState({
            status: WalletStatusType.idle,
            address: '',
            key: null,
            client: null,
            network,
            chainId,
            activeWallet: null,
        })
        disconnect()
    }

    //const currentChain = chains.find((row) => row.chainId === chainId)
    //const currentChainName = currentChain?.label.toLowerCase()

    return (
        <Box py={{ base: '4', md: '10' }} px={{ base: '4', md: '10' }}>
            <Flex
                justifyContent="space-between"
                mx="auto"
                maxWidth="container.xl"
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
            >
                <Box flex="1">
                    <Logo />
                </Box>
                <HStack flex="1" spacing="6" justify="flex-end">
                    <Wallet
                        connected={Boolean(key?.name)}
                        walletName={key?.name}
                        onDisconnect={resetWalletConnection}
                        disconnect={disconnect}
                        isOpenModal={isOpenModal}
                        onOpenModal={onOpenModal}
                        onCloseModal={onCloseModal}
                        onPrimaryButton={false}
                    />
                    <WalletModal
                        isOpenModal={isOpenModal}
                        onCloseModal={onCloseModal}
                        chainId={chainId}
                    />
                </HStack>
            </Flex>
        </Box>
    )
}

export default Header

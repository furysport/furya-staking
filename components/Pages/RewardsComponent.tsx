import {Box, Divider, HStack, Image, Text, useDisclosure, VStack,} from '@chakra-ui/react';
import Loader from 'components/Loader';
import {FC, useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import {walletState} from 'state/walletState';
import WalletModal from 'components/Wallet/Modal/WalletModal'
import ClaimButton from 'components/Pages/ClaimButton'
import UpdateRewardsButton from "components/Pages/UpdateRewardsButton"
import {tabState, TabType} from "state/tabState"
import tokens from "public/mainnet/tokens.json"

interface UndelegationsProps {
    isWalletConnected: boolean;
    isLoading: boolean;
    address: string;
    data: any;
}

const RewardsComponent: FC<UndelegationsProps> = ({
                                                      isWalletConnected,
                                                      isLoading,
                                                      data,
                                                  }) => {
    const {chainId} = useRecoilValue(walletState)
    const currentTabState = useRecoilValue(tabState)
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure();

    const claimableRewards = useMemo(
        () => data?.reduce((acc, e) => acc + (Number(e?.dollarValue) ?? 0), 0),
        [data],
    ) || 0

    const stakedDenoms = useMemo(() => data?.map((r: { stakedDenom: string })=>r.stakedDenom), [data])

    return (
        <VStack
            width="full"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            alignItems="flex-start"
            justifyContent="center"
            px={7}
            pt={7}
            spacing={1}
            borderRadius={'20px'}
            minH={320}
            minW={500}
            as="form"
            overflow="hidden"
            position="relative"
            display="flex"
        >
            {isLoading ? (
                <HStack
                    minW={100}
                    minH={100}
                    width="full"
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Loader/>
                </HStack>
            ) : (
                <>
                    <Text color={'grey'}>Rewards</Text>
                    <HStack
                        alignItems={"start"}
                        justifyContent="space-between"
                        width="100%"
                        height="100%"
                        paddingBottom={0}
                    >
                        <Text fontSize={27} fontWeight={'bold'} transform={'translateY(-3px)'}>
                            {isWalletConnected
                                ? `$${claimableRewards?.toFixed(2).toString()}`
                                : '$0'}
                        </Text>
                        <HStack gap={1}>
                            {currentTabState !== TabType.alliance &&
                             <UpdateRewardsButton
                              isWalletConnected={isWalletConnected}
                             />}
                            <ClaimButton
                                isWalletConnected={isWalletConnected}
                                onOpenModal={onOpenModal}
                                totalRewards={claimableRewards}
                                stakedDenoms={stakedDenoms}
                            />
                        </HStack>
                        <WalletModal
                            isOpenModal={isOpenModal}
                            onCloseModal={onCloseModal}
                            chainId={chainId}
                        />
                    </HStack>
                    {data?.length > 0 && <Box
                     overflowY="scroll"
                     minW={540}
                     h={170}
                     backgroundColor='#1C1C1C'
                     alignSelf={'center'}
                     px="4"
                     borderRadius="10px"
                    >
                        {data?.map((reward, index) => {
                            const logoURI = tokens.find((token) => token.symbol === reward.symbol)?.logoURI
                            return (<Box key={index} marginY={3}>
                                    <HStack justifyContent="space-between" width="100%" pr={3}>
                                        <HStack>
                                            {logoURI && <Image
                                             src={logoURI}
                                             width={5}
                                             height={5}
                                             marginRight={2}/>}
                                            <Text>{reward.symbol}</Text>
                                        </HStack>
                                        <Text>
                                            {isWalletConnected
                                                ? `${reward.amount === 0 ? 0 : reward.amount?.toFixed(6)}`
                                                : '$0'}
                                        </Text>
                                    </HStack>
                                    <HStack justifyContent="flex-end" pr={3}>
                                        <Text
                                            marginBottom={1}
                                            fontSize={11}
                                            color={isWalletConnected ? 'white' : 'transparent'}
                                        >{`≈$${reward.dollarValue?.toFixed(2).toString()}`}</Text>
                                    </HStack>
                                    {index < data.length - 1 && <Divider/>}
                                </Box>
                            )
                        })}
                    </Box>}
                </>
            )}
        </VStack>
    )
}

export default RewardsComponent

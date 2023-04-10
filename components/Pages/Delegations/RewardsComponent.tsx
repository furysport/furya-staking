import {Box, Divider, HStack, Text, useDisclosure, VStack} from "@chakra-ui/react";
import Loader from "components/Loader";
import {FC} from "react";
import {useRecoilState} from "recoil";
import {walletState} from "state/atoms/walletAtoms";
import WalletModal from "components/Wallet/Modal/Modal";
import {TokenData} from "components/Pages/Delegations/Dashboard";
import {Token} from "components/Pages/Delegations/AssetOverview";
import ClaimButton from "components/Pages/Delegations/ClaimButton";

interface UndelegationsProps{
    isWalletConnected: boolean,
    isLoading: boolean,
    address: string,
    data: TokenData[]
}
const RewardsComponent: FC<UndelegationsProps> = ({isWalletConnected, isLoading,data, address})=>{
    const [{chainId}, _] = useRecoilState(walletState)
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const claimableRewards = data?.reduce((acc, e) =>  acc + (Number(e?.dollarValue) ?? 0), 0);

    return <VStack
        width="full"
        background={"#1C1C1C"}
        alignItems="flex-start"
        justifyContent="center"
        px={7}
        pt={5}
        spacing={1}
        borderRadius={"20px"}
        minH={320}
        minW={500}
        as="form"
        overflow="hidden"
        position="relative"
        display="flex">
        {isLoading ?
            <HStack
                minW={100}
                minH={100}
                width="full"
                alignContent="center"
                justifyContent="center"
                alignItems="center">
                <Loader/>
            </HStack> :(
                <>
                    <Text
                        color={"grey"}>
                        Rewards
                    </Text>
                    <HStack
                        justifyContent="space-between"
                        width="100%"
                        height="100%"
                        paddingBottom={2}>
                        <Text
                            fontSize={27}
                            fontWeight={"bold"}>
                            {isWalletConnected ? `$${claimableRewards.toLocaleString()}`: "n/a"}
                        </Text>
                        <ClaimButton isWalletConnected={isWalletConnected} onOpenModal={onOpenModal} address={address}/>
                        <WalletModal
                            isOpenModal={isOpenModal}
                            onCloseModal={onCloseModal}
                            chainId={chainId}
                        />
                    </HStack>
                    <Box
                        overflowY="scroll"
                        minW={550}
                        minH={180}
                        backgroundColor="black"
                        px="4"
                        pt="2"
                        borderRadius="10px">
                        {data?.map((tokenData, index) => (
                            <Box key={index} marginY={3} >
                                <HStack justifyContent="space-between" width="100%" pr={3}>
                                    <Text>{Token[tokenData.token]}</Text>
                                    <Text>{isWalletConnected ? `${(tokenData.value)?.toLocaleString()}` : "n/a"}</Text>
                                </HStack>
                                <HStack  justifyContent="flex-end" pr={3}>
                                <Text marginBottom={1} fontSize={11} color={isWalletConnected ? "grey" : "black"}>{`≈$${(tokenData.dollarValue)?.toLocaleString()}`}</Text>
                                </HStack>
                                    {index < data.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>


                </>)
        }
    </VStack>
}

// @ts-ignore
export default RewardsComponent
import {Box, Button, Divider, HStack, Text, useDisclosure, VStack} from "@chakra-ui/react";
import Loader from "components/Loader";
import {FC, useMemo} from "react";
import {TxStep} from "components/Pages/Delegations/ActionsComponent";
import {useRecoilState} from "recoil";
import {walletState} from "state/atoms/walletAtoms";
import WalletModal from "components/Wallet/Modal/Modal";
import {TokenData} from "components/Pages/Delegations/Dashboard";
import {Token} from "components/Pages/Delegations/AssetOverview";

interface UndelegationsProps{
    isWalletConnected: boolean,
    isLoading: boolean,
    data: TokenData[]
}
const RewardsComponent: FC<UndelegationsProps> = ({isWalletConnected, isLoading,data})=>{
    const [{chainId}, _] = useRecoilState(walletState)
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const claimableRewards = data?.reduce((acc, e) =>  acc + (e?.value ?? 0), 0) || 0;
    const txStep = TxStep.Idle
    const buttonLabel = useMemo(() => {
        if (!isWalletConnected) return 'Connect Wallet'
        else if (claimableRewards === 0) return 'No Rewards'
        else return 'Claim'
    }, [claimableRewards, isWalletConnected])

    return <VStack
        width="full"
        background={"#1C1C1C"}
        alignItems="flex-start"
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
                        <Button
                            alignSelf="center"
                            bg="#6ACA70"
                            borderRadius="full"
                            width="100%"
                            variant="primary"
                            w={200}
                            h={45}
                            disabled={txStep == TxStep.Estimating ||
                                txStep == TxStep.Posting ||
                                txStep == TxStep.Broadcasting ||
                                (isWalletConnected && claimableRewards === 0)}
                            maxWidth={570}
                            isLoading={
                                txStep == TxStep.Estimating ||
                                txStep == TxStep.Posting ||
                                txStep == TxStep.Broadcasting}
                            onClick={async ()=>{
                                if(isWalletConnected) {
                                    // await submit(ActionType.claim,null,null)}
                                }else{
                                    onOpenModal()
                                }
                                }
                            }
                            style={{textTransform: "capitalize", transform: "translateY(-10px)"}}>
                            {buttonLabel}
                        </Button>
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
                                    <Text>{isWalletConnected ? tokenData.value: "n/a"}</Text>
                                </HStack>
                                <HStack  justifyContent="flex-end" pr={3}>
                                <Text marginBottom={1} fontSize={11} color={isWalletConnected ? "grey" : "black"}>{`≈$${tokenData.value}`}</Text>
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
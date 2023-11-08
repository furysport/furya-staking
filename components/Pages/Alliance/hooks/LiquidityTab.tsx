import {HStack, Text, VStack} from "@chakra-ui/react"
import CardComponent, {AssetType} from "components/Pages/CardComponent"
import AssetOverview, {TokenType} from "components/Pages/AssetOverview"
import RewardsComponent from "components/Pages/RewardsComponent"
import CustomButton from "components/CustomButton"
import {useRouter} from "next/router"
import {useCalculateAprs} from "components/Pages/Ecosystem/hooks/useCalculateAprs";

export const LiquidityTab = ({
                                 isWalletConnected,
                                 isLoading,
                                 address,
                                 updatedData,
                             }) => {
    const router = useRouter()
    const openDelegate = async () => await router.push('/liquidity/delegate?tokenSymbol=USDC-WHALE-LP')
    const openUndelegate = async () => await router.push('/liquidity/undelegate?tokenSymbol=USDC-WHALE-LP')

    const aprs = useCalculateAprs()

    return <VStack
        pt={12}
        maxW={1270}
        alignItems={'flex-start'}
        spacing={6}>
        <HStack width={"full"} justifyContent={"space-between"}>
            <Text as="h1"
                  fontSize="37"
                  fontWeight="700">
                Liquidity
            </Text>
            <HStack pr={2}>
                <CustomButton isTransparent={true}
                              onClick={()=>openDelegate()}
                              disabled={!isWalletConnected}
                              buttonLabel={"Delegate"}
                              height={"42px"}
                              width={"198px"}/>
                <CustomButton isTransparent={true}
                              onClick={()=>openUndelegate()}
                              disabled={!isWalletConnected}
                              buttonLabel={"Undelegate"}
                              height={"42px"}
                              width={"198px"}/>
            </HStack>
        </HStack>
        <HStack width="full" paddingY={5} spacing={10}>
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            assetType={AssetType.total}
            title={'Total Assets'}
            tokenData={updatedData?.total}
        />
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            title={'Liquid Assets'}
            tokenData={updatedData?.liquid}
        />
        <CardComponent
            isWalletConnected={isWalletConnected}
            isLoading={isLoading}
            title={'Staked Assets'}
            tokenData={updatedData?.delegated}
        />
    </HStack>
        <HStack width="full" spacing={10}>
            <AssetOverview
                isLoading={isLoading}
                data={updatedData && updatedData?.delegated}
                isWalletConnected={isWalletConnected}
                aprs={aprs}
            />
            <RewardsComponent
                isWalletConnected={isWalletConnected}
                isLoading={isLoading}
                data={updatedData && updatedData[TokenType[TokenType.rewards]]}
                address={address}
            />
        </HStack>
    </VStack>
}

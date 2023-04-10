import {Box,  HStack, Text, VStack,} from '@chakra-ui/react'

import {Cell, Pie, PieChart} from 'recharts'

import Loader from '../../Loader'


export enum Token {
     WHALE, ampLUNA, bLUNA
}

export enum TokenType {
    liquid, delegated, undelegated, rewards
}

const AssetOverview = ({
                             isWalletConnected,
                             isLoading,
                             data
                         }) => {

    const borderRadius = "30px"
    const TokenBox = ({token}) => {
        const {color} = data.find(e => e.token === token)

        return (
            <HStack
                mr="10"
                paddingBottom={4}>
                <Box
                    bg={color}
                    w="4"
                    h="4"
                    borderRadius="50%"
                    mr="2">
                </Box>
                <Text >{Token[token]}</Text>
            </HStack>
        );
    };
    let aggregatedAssets = data?.reduce((acc, e) =>  acc + (e?.value ?? 0), 0);
    return <VStack
        width="full"
        background={"#1C1C1C"}
        borderRadius={borderRadius}
        alignItems="flex-start"
        verticalAlign="center"
        minH={320}
        minW={640}
        as="form"
        overflow="hidden"
        position="relative"
        display="flex"
        justifyContent="center">
        {isLoading ?
            <HStack
                minW={100}
                minH={100}
                width="full"
                alignContent="center"
                justifyContent="center"
                alignItems="center"
            >
                <Loader/>
            </HStack> :
            <HStack
                alignItems="center"
                justifyContent="space-between"
                pl={8}
                pt={5}
                spacing={70}>
                <VStack
                    alignItems="start"
                    alignSelf="flex-start">
                    <Text
                        paddingBottom={8}
                        color="whiteAlpha.600">
                        Assets
                    </Text>
                    {data?.map(e =>
                        (<TokenBox key={`tokenBox-${e.token}`} token={e.token}/>)
                    )}
                </VStack>
                <VStack
                    alignItems="start"
                    alignSelf="start"
                    paddingTop={16}

                spacing={6}
                pb={3}
                w={85}>
                    {data?.map(e =>
                        (<Text key={e.color}>
                                {isWalletConnected ? `$${(e.dollarValue)?.toLocaleString()}` : "n/a"}
                            </Text>
                    ))}
                </VStack>
                <PieChart
                    style={{pointerEvents: 'none'}}
                    width={290}
                    height={275}>
                    <Pie
                        data={isWalletConnected && aggregatedAssets !== 0 ? data : [{value: 1}]}
                        cx="42%"
                        cy="45%"
                        innerRadius={95}
                        outerRadius={120}
                        dataKey="value"
                        stroke="none">
                        {isWalletConnected ?
                            data?.map((_entry: any, index: number) => (<Cell
                                    key={`cell-${index}`}
                                    fill={data[index].color}/>)) :
                            <Cell
                                key={"cell-${index}"}
                                fill="grey"/>}
                    </Pie>
                </PieChart>
            </HStack>}
    </VStack>
}
export default AssetOverview


import React, { useEffect, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Cell, Pie, PieChart, LabelList } from "recharts";
import { getColorByTokenSymbol } from "util/getColorByTokenSymbol";

const TokenBox = ({ symbol, color }) => {
    return (
        <HStack mr="10">
            <Box bg={color} w="4" h="4" borderRadius="50%" mr="2"></Box>
            <Text
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '80%',
                    fontWeight: 500,
                }}
            >
                {symbol}
            </Text>
        </HStack>
    )
}

export const DashboardPieChart = ({ dashboardData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const totalValue = dashboardData.reduce((acc, data) => acc + data.totalValueStaked, 0);
        const adjustedData = dashboardData.map((data) => ({
            tokenSymbol: data.symbol,
            value: data.totalValueStaked,
            color: getColorByTokenSymbol(data.symbol),
            percentage: ((data.totalValueStaked / totalValue) * 100).toFixed(2) + '%',
        }));
        setData(adjustedData);
    }, [dashboardData]);

    return (
        <HStack
            alignItems="center"
            alignSelf={"center"}
            justify={"center"}
            pl={8}
            pt={3}
            spacing={35}
            width={"full"}
        >
            <VStack alignItems="start" alignSelf="center" w={160}>
                {data.map((e) => (
                    <VStack key={`tokenBox-${e.tokenSymbol}`} alignItems={'flex-start'}>
                        <TokenBox symbol={e.tokenSymbol} color={e.color} />
                    </VStack>
                ))}
            </VStack>
            <PieChart style={{ pointerEvents: 'none' }} width={500} height={355}>
                <Pie
                    data={data}
                    cx="42%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={150}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="percentage" position="outside"  style={{ fill: 'white' }}/>
                </Pie>
            </PieChart>
        </HStack>
    )
}

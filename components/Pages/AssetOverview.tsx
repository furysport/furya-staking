import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import Loader from 'components/Loader';
import { Cell, Pie, PieChart } from 'recharts';

export enum Token {
  WHALE = 'WHALE',
  ampLUNA = 'ampLUNA',
  bLUNA = 'bLUNA',
  mUSDC = 'mUSDC',
  ASH = 'ASH',
  'USDC-WHALE-LP'= 'USDC-WHALE-LP',
}

export enum TokenType {
  liquid,
  delegated,
  undelegated,
  rewards,
}
const TokenBox = ({ token, data }) => {
  const { color } = data.find((e) => e.token === token);

  return (
    <HStack mr="10">
      <Box bg={color} w="4" h="4" borderRadius="50%" mr="2"></Box>
      <Text
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '80%', // Ensures it doesn't overflow the parent container
        }}
      >
        {Token[token]}
      </Text>
    </HStack>
  );
};

const AssetOverview = ({ isWalletConnected, isLoading, data, aprs }) => {
  const borderRadius = '30px';

  const aggregatedAssets = data?.reduce((acc, e) => acc + (e?.value ?? 0), 0);
  return (
    <VStack
      width="full"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      borderRadius={borderRadius}
      alignItems="flex-start"
      verticalAlign="center"
      h={320}
      w={1500}
      as="form"
      overflow="hidden"
      position="relative"
      display="flex"
      justifyContent="center"
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
          <Loader />
        </HStack>
      ) : (
        <HStack
          alignItems="center"
          justifyContent="space-between"
          pl={8}
          pt={3}
          spacing={35}
        >
          <VStack alignItems="start" alignSelf="flex-start" w={160}>
            <Text paddingBottom={5} color="whiteAlpha.600">
              Delegated Assets
            </Text>
            {data?.map((e) => {
              const apr = aprs?.find((apr) => apr.name === e.tokenSymbol);
              return (
                <VStack key={`tokenBox-${e.token}`} alignItems={'flex-start'}>
                  <TokenBox token={e.token} data={data} />
                  <Text paddingBottom={4} color={'gray'}>
                    {`APR ≈${apr?.apr.toFixed(1)}%`}
                  </Text>
                </VStack>
              );
            })}
          </VStack>
          <VStack
            alignItems="start"
            alignSelf="flex-start"
            paddingTop={'53px'}
            spacing={14}
            pb={0}
            w={100}
          >
            {data?.map((e) => (
              <Text key={e.color}>
                {isWalletConnected
                  ? `$${e.dollarValue?.toFixed(2)}`
                  : '$0'}
              </Text>
            ))}
          </VStack>
          <PieChart style={{ pointerEvents: 'none' }} width={290} height={275}>
            <Pie
              data={
                isWalletConnected && aggregatedAssets !== 0
                  ? data
                  : [{ value: 1 }]
              }
              cx="42%"
              cy="45%"
              innerRadius={95}
              outerRadius={120}
              dataKey="value"
              stroke="none"
            >
              {isWalletConnected ? (
                data?.map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={data[index].color} />
                ))
              ) : (
                <Cell fill="grey" />
              )}
            </Pie>
          </PieChart>
        </HStack>
      )}
    </VStack>
  );
};
export default AssetOverview;

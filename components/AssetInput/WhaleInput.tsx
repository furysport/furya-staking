import {FC} from 'react';

import {ChevronDownIcon} from '@chakra-ui/icons';
import {
    forwardRef,
    HStack,
    IconButton,
    Image,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react';
import FallbackImage from 'components/FallbackImage';
import AssetSelectModal from './AssetSelectModal';
import {useTokenList} from "hooks/useTokenList";

interface AssetInputProps {
    image?: boolean;
    token: any;
    value: any;
    onChange: (value: any, isTokenChange?: boolean) => void;
    showList?: boolean;
    onInputFocus?: () => void;
    balance?: number;
    disabled?: boolean;
    minMax?: boolean;
    isSingleInput?: boolean;
    hideToken?: string;
    edgeTokenList?: string[];
    ignoreSlack?: boolean;
    hideLogo?: boolean;
}

const AssetSelectTrigger = ({currentTokenSymbol, hideLogo = false}) => {
    const tokens = useTokenList()?.tokens
    const token = tokens?.find((e) => e.symbol === currentTokenSymbol)
    if (!token?.symbol && !currentTokenSymbol)
        return (
            <Text
                width="fit-content"
                fontSize="18px"
                fontWeight="400"
                color="brand.50"
            >
                Select Token
            </Text>
        )

    return (
        <HStack gap={[1]} px={2} justify={"flex-end"}>
            {!hideLogo && <Image
             width="auto"
             minW="1.5rem"
             maxW="1.5rem"
             maxH="1.5rem"
             style={{margin: 'unset'}}
             src={token?.logoURI}
             alt="logo-small"
             fallback={<FallbackImage/>}
            />}
            <Text fontSize="16px" fontWeight="400" style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%', // Ensures it doesn't overflow the parent container
            }}>
                {token?.symbol || currentTokenSymbol || 'Select Token'}
            </Text>
        </HStack>
    );
};

const WhaleInput: FC<AssetInputProps> = forwardRef(
    (
        {
            image = true,
            token,
            onChange,
            value,
            showList = true,
            disabled,
            hideToken,
            hideLogo = false,
        },
        ref,
    ) => {
        return (
            <Stack
                direction={['column-reverse', 'row']}
                width="full"
                spacing={0}
                gap={[3, 0]}
            >
                <HStack
                    width="full"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderLeftRadius="30px"
                    borderRightRadius={['30px', 'unset']}
                    height={12}
                    paddingLeft={6}
                    paddingRight={3}
                >
                    <HStack flex={1}>
                        <Input
                            ref={ref}
                            type="number"
                            value={value?.amount || ''}
                            variant="unstyled"
                            color="brand.500"
                            placeholder="0.00"
                            disabled={false} //disabled || (!isSingleInput && !tokenInfo?.symbol
                            onChange={({target}) => {
                                //console.log({ ...token, amount: target.value })
                                onChange({...token, amount: target.value});
                            }}
                        />
                    </HStack>
                </HStack>

                <HStack
                    width={['full', '200px']}
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRightRadius="30px"
                    borderLeftRadius={['30px', 'unset']}
                    height={12}
                    paddingX={2}
                    justifyContent={'flex-end'}
                >
                    <HStack flex={1}>
                        <AssetSelectModal
                            onChange={onChange}
                            currentTokenSymbol={hideToken}
                            disabled={disabled || !showList}
                            amount={token?.amount}
                        >
                            <AssetSelectTrigger
                                currentTokenSymbol={hideToken} hideLogo={hideLogo}
                            />

                            {showList && (
                                <IconButton
                                    disabled={disabled}
                                    margin="unset"
                                    variant="unstyled"
                                    color="white"
                                    aria-label="go back"
                                    icon={<ChevronDownIcon/>}
                                    style={{margin: 'unset'}}
                                />
                            )}
                        </AssetSelectModal>
                    </HStack>
                </HStack>
            </Stack>
        );
    },
);

export default WhaleInput;

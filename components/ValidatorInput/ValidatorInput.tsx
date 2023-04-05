import {HStack, IconButton, Text} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import ValidatorSelectModal from "components/ValidatorInput/ValidatorSelectModal";
import {FC} from "react";

interface ValidatorInputProps {
    image?: boolean
    value: any
    onChange: (value: any, isTokenChange?: boolean) => void
    showList?: boolean
    onInputFocus?: () => void
    disabled?: boolean
    validatorList?: string[]
    ignoreSlack?: boolean
}

const ValidatorInput : FC<ValidatorInputProps> = (props)=>{

    return <HStack
        width={['full', '510px']}
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="30px"
        height={12}
        paddingX={2}
        justifyContent={'flex-end'}
    >
        <HStack flex={1}>
        <ValidatorSelectModal
            onChange={props.onChange}
            currentValidator={"Validator"}//[tokenInfo?.symbol || hideToken]
            validatorList={[]}
            disabled={false}
        >
            {/*<AssetSelectTrigger*/}
            {/*  tokenInfo={tokenInfo}*/}
            {/*  showIcon={image}*/}
            {/*  symbol={token?.tokenSymbol}*/}
            {/*/>*/}

            {props.showList && (
                <HStack >
                    <Text pl="4" pr="350" >Validator</Text>
                    <IconButton
                        disabled={props.disabled}
                        variant="unstyled"
                        color="white"
                        aria-label="go back"
                        icon={<ChevronDownIcon />}
                    />
                </HStack>
            )}
        </ValidatorSelectModal>
        </HStack>
    </HStack>
}

export default ValidatorInput
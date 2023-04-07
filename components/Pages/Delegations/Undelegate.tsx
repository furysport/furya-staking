import React, {FC, useEffect} from 'react'
import {Text, VStack} from '@chakra-ui/react'
import AssetInput from '../../AssetInput'
import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {Controller, useForm} from "react-hook-form";
import {delegationAtom, DelegationState} from "state/atoms/delegationAtoms";
import ValidatorInput from "components/ValidatorInput/ValidatorInput";
import {ActionProps, TokenPriceBalance} from "components/Pages/Delegations/Delegate";
import tokenList from "public/mainnet/white_listed_token_info.json";

const Undelegate : FC<ActionProps> = ({tokens})  => {

    const [{status}, _] = useRecoilState(walletState)
    const [currentDelegationState, setCurrentDelegationState] = useRecoilState<DelegationState>(delegationAtom)

    const isWalletConnected = status === WalletStatusType.connected
    const onInputChange = ( tokenSymbol: string | null , amount: number) => {

        if(tokenSymbol){
            setCurrentDelegationState({...currentDelegationState, tokenSymbol:tokenSymbol, amount:Number(amount)})}else{
            setCurrentDelegationState({...currentDelegationState,amount:Number(amount)})
        }
    }

    useEffect(() => {
        const newState: DelegationState = {
            tokenSymbol: "WHALE",
            amount: 0,
            decimals: 6,
            validatorSrcName:null,
            validatorDestName:null,
            validatorSrcAddress:null,
            validatorDestAddress:null,denom: null
        }
        setCurrentDelegationState(newState)
    }, [isWalletConnected])


    const { control } = useForm({
        mode: 'onChange',
        defaultValues: {
             currentDelegationState
        },
    })
    const currentToken : TokenPriceBalance = tokens?.find(e=>e.tokenSymbol===currentDelegationState.tokenSymbol)
    return <VStack
        px={7}
        width="full"
    alignItems="flex-start"
        marginBottom={5}>
        <Text>From</Text>
        <Controller
            name="currentDelegationState"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
        <ValidatorInput
            value={1}
            delegatedOnly={true}
            onChange={(validator) => {
                field.onChange(validator)
                setCurrentDelegationState({
                    ...currentDelegationState,
                    validatorDestAddress: validator.operator_address,
                    validatorDestName: validator.description.moniker
                })
            }}
            showList={true}/>)}
        />
        <Text pt={5}>Amount</Text>
        <Controller
            name="currentDelegationState"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <AssetInput
                    hideToken={currentDelegationState.tokenSymbol}
                    {...field}
                    token={currentDelegationState}
                    whalePrice={currentToken?.price }
                    balance={currentToken?.balance}
                    minMax={false}
                    disabled={false}
                    onChange={(value, isTokenChange) => {
                        onInputChange(value, 0)
                        field.onChange(value)
                        if(isTokenChange){
                            const denom = tokenList.find(t=>t.symbol === value.tokenSymbol).denom
                            setCurrentDelegationState({...currentDelegationState,
                                tokenSymbol: value.tokenSymbol,
                                amount: value.amount,
                            denom: denom})}
                        else{
                            setCurrentDelegationState({...currentDelegationState, amount: value.amount})
                        }
                    }}
                />
            )}
        />
    </VStack>

}

export default Undelegate

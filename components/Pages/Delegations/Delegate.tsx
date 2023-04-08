import React, {FC, useEffect, useMemo} from 'react'
import {Text, VStack} from '@chakra-ui/react'
import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {Controller, useForm} from "react-hook-form";
import {delegationAtom, DelegationState} from "state/atoms/delegationAtoms";
import AssetInput from "components/AssetInput";
import ValidatorInput from "components/ValidatorInput/ValidatorInput";
import tokenList from "public/mainnet/white_listed_token_info.json";
import useValidators from "hooks/useValidators";
import usePrice from "hooks/usePrice";
import tokens from "public/mainnet/white_listed_token_info.json";

export interface TokenBalance {
    tokenSymbol: string,
    balance: number
}

export interface ActionProps {
    balance: TokenBalance[]
    validatorAddress:string
}

const Delegate: FC<ActionProps> = ({balance, validatorAddress}) => {

    const [{status, address}, _] = useRecoilState(walletState)
    const [currentDelegationState, setCurrentDelegationState] = useRecoilState<DelegationState>(delegationAtom)

    const isWalletConnected = status === WalletStatusType.connected
    const {data: {validators = []} = {}} = useValidators({address})

    const chosenValidator = useMemo(()=>validators.find(v=>v.operator_address === validatorAddress),[validatorAddress])
    const onTokenInputChange = (tokenSymbol: string | null, amount: number) => {

        if (tokenSymbol) {
            setCurrentDelegationState({...currentDelegationState, tokenSymbol: tokenSymbol, amount: Number(amount)})
        } else {
            setCurrentDelegationState({...currentDelegationState, amount: Number(amount)})
        }
    }

    const onValidatorChange = (validatorDestName: string | null, validatorSrcName: string | null, validatorDestAddress: string | null, validatorSrcAddress: string | null) => {

        if (validatorDestAddress) {
            setCurrentDelegationState({
                ...currentDelegationState,
                validatorDestAddress: validatorDestAddress,
                validatorDestName: validatorDestName
            })
        } else {
            setCurrentDelegationState({
                ...currentDelegationState,
                validatorSrcAddress: validatorSrcAddress,
                validatorSrcName: validatorSrcName
            })
        }
    }

    useEffect(() => {
        const token = tokens.find(e=>e.symbol === "ampLUNA")
        const newState: DelegationState = {
            tokenSymbol: token.symbol,
            amount: 0,
            decimals: 6,
            validatorSrcAddress: null,
            validatorDestAddress: chosenValidator?.operator_address,
            validatorDestName: chosenValidator?.description.moniker,
            denom: token.denom
        }
        setCurrentDelegationState(newState)
    }, [isWalletConnected, chosenValidator])


    const {control} = useForm({
        mode: 'onChange',
        defaultValues: {
            currentDelegationState
        },
    })
    const currentTokenBalance: TokenBalance = balance?.find(e => e.tokenSymbol === currentDelegationState.tokenSymbol)
    const [priceList, timestamp] = usePrice() || []

    const price = useMemo(
        () => priceList?.[tokens?.find((e) => e.symbol === currentDelegationState.tokenSymbol)?.name],
        [priceList, currentDelegationState.tokenSymbol]
    );
    return <VStack
        px={7}
        width="full"
        alignItems="flex-start"
        marginBottom={5}>
        <Text>
            To
        </Text>
        <Controller
            name="currentDelegationState"
            control={control}
            rules={{required: true}}
            render={({field}) => (
                <ValidatorInput
                    value={1}
                    delegatedOnly={false}
                    validatorName={currentDelegationState.validatorDestName}
                    onChange={(validator) => {
                        field.onChange(validator)
                        setCurrentDelegationState({
                            ...currentDelegationState,
                            validatorDestAddress: validator.operator_address,
                            validatorDestName: validator.description.moniker
                        })
                    }}
                    showList={true}/>)}/>
        <Text
            pt={5}>
            Amount
        </Text>
        <Controller
            name="currentDelegationState"
            control={control}
            rules={{required: true}}
            render={({field}) => (
                <AssetInput
                    hideToken={currentDelegationState.tokenSymbol}
                    {...field}
                    token={currentDelegationState}
                    whalePrice={price}
                    balance={currentTokenBalance?.balance}
                    minMax={false}
                    disabled={false}
                    onChange={(value, isTokenChange) => {
                        onTokenInputChange(value, 0)
                        field.onChange(value)
                        if (isTokenChange) {
                            const denom = tokenList.find(t=>t.symbol === value.tokenSymbol).denom
                            setCurrentDelegationState({
                                ...currentDelegationState,
                                tokenSymbol: value.tokenSymbol,
                                amount: value.amount,
                                denom: denom
                            })
                        } else {
                            setCurrentDelegationState({...currentDelegationState, amount: value.amount})
                        }
                    }}
                />
            )}
        />
    </VStack>

}

export default Delegate

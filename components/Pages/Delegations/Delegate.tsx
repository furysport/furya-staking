import React, {FC, useEffect, useState} from 'react'
import {Text, VStack} from '@chakra-ui/react'
import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {Controller, useForm} from "react-hook-form";
import {delegationAtom, TokenItemState} from "state/atoms/delegationAtoms";
import AssetInput from "components/AssetInput";
import ValidatorInput from "components/ValidatorInput/ValidatorInput";
import {TokenInfo} from "hooks/useTokenInfo";

export interface TokenPriceBalance{
    tokenSymbol: string,
    balance: number
    price: number
}

export interface ActionProps{
    tokens: TokenPriceBalance[]
}

const Delegate :FC<ActionProps> = ({tokens}) => {

    const [{status}, _] = useRecoilState(walletState)
    const [currentBondState, setCurrentBondState] = useRecoilState<TokenItemState>(delegationAtom)

    const isWalletConnected = status === WalletStatusType.connected

    const onInputChange = (tokenSymbol: string | null, amount: number) => {

        if (tokenSymbol) {
            setCurrentBondState({...currentBondState, tokenSymbol: tokenSymbol, amount: Number(amount)})
        } else {
            setCurrentBondState({...currentBondState, amount: Number(amount)})
        }
    }

    useEffect(() => {
        const newState: TokenItemState = {
            tokenSymbol: "WHALE",
            amount: 0,
            decimals: 6,
        }
        setCurrentBondState(newState)
    }, [isWalletConnected])


    const {control} = useForm({
        mode: 'onChange',
        defaultValues: {
            currentBondState
        },
    })
    const currentToken : TokenPriceBalance = tokens?.find(e=>e.tokenSymbol===currentBondState.tokenSymbol)

    return <VStack
        px={7}
        width="full"
        alignItems="flex-start"
        marginBottom={5}>
        <Text>
            To
        </Text>
        <ValidatorInput
            value={1}
            onChange={() => {}}
            showList={true}/>
        <Text
            pt={5}>
            Amount
        </Text>
        <Controller
            name="currentBondState"
            control={control}
            rules={{required: true}}
            render={({field}) => (
                <AssetInput
                    hideToken={currentBondState.tokenSymbol}
                    {...field}
                    token={currentBondState}
                    whalePrice={currentToken?.price}
                    balance={currentToken?.balance}
                    minMax={false}
                    disabled={false}
                    onChange={(value, isTokenChange) => {
                        onInputChange(value, 0)
                        field.onChange(value)
                        if (isTokenChange) {
                            setCurrentBondState({
                                ...currentBondState,
                                tokenSymbol: value.tokenSymbol,
                                amount: value.amount
                            })
                        } else {
                            setCurrentBondState({...currentBondState, amount: value.amount})
                        }
                    }}
                />
            )}
        />
    </VStack>

}

export default Delegate

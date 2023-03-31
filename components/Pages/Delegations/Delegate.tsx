import React, {useEffect, useState} from 'react'
import {VStack} from '@chakra-ui/react'
import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "state/atoms/walletAtoms";
import {Controller, useForm} from "react-hook-form";
import {delegationAtom, TokenItemState} from "state/atoms/delegationAtoms";
import AssetInput from "components/AssetInput";

const Delegate = ()  => {

  const [{status}, _] = useRecoilState(walletState)
  const [currentBondState, setCurrentBondState] = useRecoilState<TokenItemState>(delegationAtom)

  const isWalletConnected = status === WalletStatusType.connected

  //const {bondingConfig} = useBondingConfig(client)
  // const unbondingPeriodInNano = Number(bondingConfig?.unbonding_period)*1_000_000_000 ?? 60*1_000_000_000

  //const {unbondingAmpWhale, unbondingBWhale} = useUnbonding(client, address)

  const onInputChange = ( tokenSymbol: string | null , amount: number) => {

    if(tokenSymbol){
      setCurrentBondState({...currentBondState, tokenSymbol:tokenSymbol, amount:Number(amount)})}else{
      setCurrentBondState({...currentBondState,amount:Number(amount)})
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


  const { control } = useForm({
    mode: 'onChange',
    defaultValues: {
      currentBondState
    },
  })

  return <VStack
      px={7}
      width="full">
    <Controller
        name="currentBondState"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <AssetInput
                hideToken={currentBondState.tokenSymbol}
                {...field}
                token={currentBondState}
                whalePrice={0.02}
                balance={0}
                minMax={false}
                disabled={false}
                onChange={(value, isTokenChange) => {
                  onInputChange(value, 0)
                  field.onChange(value)
                  if(isTokenChange){
                    setCurrentBondState({...currentBondState, tokenSymbol: value.tokenSymbol,amount: value.amount })}
                  else{
                    setCurrentBondState({...currentBondState, amount: value.amount})
                  }
                }}
            />
        )}
    />
  </VStack>

}

export default Delegate

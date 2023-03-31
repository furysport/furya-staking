import { atom } from 'recoil'
export interface TokenItemState {
    tokenSymbol: string
    amount: number
    decimals: number
}
export const delegationAtom = atom<TokenItemState>({
    key: 'delegationAtom',
    default:
        {
            tokenSymbol: null,
            amount: 0,
            decimals: 6,
        },
    effects_UNSTABLE: [
    ],
})


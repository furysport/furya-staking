import {useRecoilValue} from 'recoil';
import {walletState} from 'state/walletState';
import {useQuery} from 'react-query';
import {TokenInfo} from 'hooks/useTokenInfo';
import {tabState, TabType} from "state/tabState";

export const useTokenList = () => {
    const {chainId, network} = useRecoilValue(walletState)
    const tabType = useRecoilValue(tabState)
    let tokenInfoList: TokenInfo[]
    let isLoading: boolean
    if (tabType === TabType.alliance) {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-alliance', chainId, network],
            async () => {
                const url = `/${network}/white_listed_alliance_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                enabled: !!chainId && !!network,
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    } else if (tabType === TabType.ecosystem) {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-ecosystem', chainId, network],
            async () => {
                const url = `/${network}/white_listed_ecosystem_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                enabled: !!chainId && !!network,
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    } else {
        const {data, isLoading: loading} = useQuery<TokenInfo[]>(
            ['tokenInfo-liquidity', chainId, network],
            async () => {
                const url = `/${network}/white_listed_liquidity_token_info.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                enabled: !!chainId && !!network,
                refetchOnMount: false,
            },
        )
        tokenInfoList = data
        isLoading = loading
    }

    return {tokens: tokenInfoList, isLoading};
};

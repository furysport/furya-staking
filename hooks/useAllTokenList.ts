import {useRecoilValue} from 'recoil';
import {walletState} from 'state/walletState';
import {useQuery} from 'react-query';
import {TokenInfo} from 'hooks/useTokenInfo';

export const useAllTokenList = () => {
    const {chainId, network} = useRecoilValue(walletState)

        const {data, isLoading} = useQuery<TokenInfo[]>(
            ['tokenInfo-alliance', chainId, network],
            async () => {
                const url = `/${network}/all_white_listed_tokens.json`;
                const response = await fetch(url);
                return await response?.json();
            },
            {
                enabled: !!chainId && !!network,
                refetchOnMount: false,
            },
        )

    return {tokens: data , isLoading};
};

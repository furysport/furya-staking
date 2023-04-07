import { useQuery} from 'react-query';
import { useMemo, useState} from 'react';
import { debounce } from 'lodash';
import {LCDClient, Validator} from "@terra-money/feather.js";
import {AllianceDelegationResponse} from "@terra-money/feather.js/dist/client/lcd/api/AllianceAPI";

export interface ValidatorData {
    validator: Validator
    delegationResponse: AllianceDelegationResponse[]
}

const fetchValidators = async (client: LCDClient, chainId: string, address: string) => {
    const validators = await client.staking.validators(chainId);
    console.log("herere validators")
    console.log(validators)
    const allianceValidatorData = await Promise.all(validators[0].map(async v => ({
        validator: v,
        delegationResponse: (await fetchValidatorDelegations(client, address, v.operator_address)).delegations,
    })));
    return { allianceValidatorData };
};

const fetchValidatorDelegations = async (client: LCDClient, address: string, operatorAddress: string) => {
    return client.alliance.alliancesDelegationByValidator(address, operatorAddress);
};

const fetchDelegations = async (client: LCDClient, chainId: string, address: string) => {
    const delegation = await client.alliance.alliancesDelegation(address);
    return { delegation };
};

const fetchRewards = async (client: LCDClient, chainId: string, address: string, validatorAddress: string, denom: string) => {
    return client.alliance.delegatorRewards(address, validatorAddress, denom);
};

export const useDashboardData = (chainId: string, address: string) => {
    const debouncedRefetch = useMemo(() => debounce((refetchFunc) => refetchFunc(), 500), []);
    const client = useMemo(() => LCDClient.fromDefaultConfig("mainnet"), []);
    const [validators, setValidators] = useState<ValidatorData[]>([]);
    const [delegations, setDelegations] = useState<AllianceDelegationResponse[]>([]);
    const [rewards, setRewards] = useState<Record<string, string>>({});

    const validatorQuery = useQuery({
        queryKey: ['validators', chainId],
        queryFn: async () => {
            const data = await fetchValidators(client, chainId, address);
            setValidators(data.allianceValidatorData);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const delegationQuery = useQuery({
        queryKey: ['delegations', chainId],
        queryFn: async () => {
            const data = await fetchDelegations(client, chainId, address);
            setDelegations(data.delegation.delegations);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const rewardsQuery = useQuery({
        queryKey: ['rewards', chainId],
        queryFn: async () => {
            const data: Record<string, any> = {};
            await Promise.all(
                validators.map(async (v) => {
                    const reward = await fetchRewards(client, chainId, address, v.validator.operator_address, "uluna");
                    data[v.validator.operator_address] = reward;
                })
            );
            setRewards(data);
            return data;
        },
        enabled: !!client && !!chainId,
        refetchOnMount: 'always',
    });

    const isLoading = useMemo(
        () => [validatorQuery, delegationQuery, rewardsQuery].some((query) => query.isLoading || query.data === null || query.data === undefined),
        [validatorQuery, delegationQuery, rewardsQuery]
    );

    const refetchAll = () => {
        [validatorQuery, delegationQuery, rewardsQuery].forEach((query) => {
            debouncedRefetch(query.refetch);
        });
    };

    const data = useMemo(() => {
        return {
            validators,
            delegations,
            rewards,
        };
    }, [validators, delegations, rewards]);

    return {...data, isLoading, refetch: refetchAll};
}

import { useQuery } from 'react-query';

import { LCDClient, Validator } from '@terra-money/feather.js';
import { Pagination } from '@terra-money/feather.js/dist/client/lcd/APIRequester';
import { ValidatorInfo } from 'components/Pages/Alliance/ValidatorInput/ValidatorList';
import useLCDClient from 'hooks/useLCDClient';
import { num } from 'libs/num';
import allianceTokens from 'public/mainnet/white_listed_alliance_token_info.json'
import { convertMicroDenomToDenom } from 'util/conversion';

import useDelegations from './useDelegations';

type GetValidatorsParams = {
  client: LCDClient | null;
  validatorInfo: [Validator[], Pagination] | undefined;
  delegations: any[]
};

const getValidators = ({
  client,
  validatorInfo,
  delegations,
}: GetValidatorsParams) => {
  const getIsDelegated = (validator: any) => {
    const delegation = delegations.find(({ delegation }) => delegation?.validator_address === validator?.validator_addr);
    return Boolean(delegation);
  };

  return client?.alliance.
    alliancesByValidators('migaloo-1').
    then((data) => {
      const [validators = [], pagination] = validatorInfo || [];

      // Sum of validator shares
      const totalShares = validators.reduce((acc, v) => acc.plus(v.delegator_shares.toString()),
        num(0));
      const delegatedValidators = data?.validators as any[];

      const validatorsWithInfo = validators?.
        map((validator) => {
          const delegatedValidator = delegatedValidators?.find((v) => v?.validator_addr === validator.operator_address);
          const delegated = getIsDelegated(delegatedValidator);
          const rate = validator?.commission?.commission_rates.rate.toString();
          const share = validator?.delegator_shares.toString();
          const votingPower = num(100).
            times(share!).
            div(totalShares).
            toFixed(2);
          const commission = num(rate).times(100).
            toFixed(0);

          return {
            ...validator,
            ...delegatedValidator,
            delegated,
            commission,
            votingPower,
          };
        }).
        filter((v: any) => v.status === 'BOND_STATUS_BONDED');

      return { validators: validatorsWithInfo,
        pagination };
    }).
    catch((error) => {
      console.log({ error });
      return [[], {}];
    });
};
const getStakedWhale = async ({ client }) => {
  let sum = 0;
  await client?.staking.validators('migaloo-1').then((data) => {
    data[0].forEach((validator) => {
      sum += Number(validator.tokens.toString());
    });
  });
  return convertMicroDenomToDenom(sum, 6);
};
type UseValidatorsResult = {
  data: {
    validators: ValidatorInfo[]
    pagination: any;
    stakedWhale: number
    stakedAmpLuna: number
    stakedBLuna: number
  }
  isFetching: boolean
};
const getStakedLSTLunaAmounts = async ({ client }) => {
  const { validators } = await client.alliance.alliancesByValidators('migaloo-1')
  const bLunaDenom = allianceTokens.find((token) => token.symbol === 'bLUNA').denom
  const ampLunaDenom = allianceTokens.find((token) => token.symbol === 'ampLUNA').denom
  let totalAmpLunaAmount = 0
  let totalBLunaAmount = 0
  validators.map((v) => {
    const bLuna = v.total_staked.find((token) => token.denom === bLunaDenom)?.amount || 0
    const ampLuna = v.total_staked.find((token) => token.denom === ampLunaDenom)?.amount || 0
    totalAmpLunaAmount += convertMicroDenomToDenom(ampLuna, 6)
    totalBLunaAmount = totalAmpLunaAmount + convertMicroDenomToDenom(bLuna, 6)
    return null
  })
  return { totalAmpLunaAmount,
    totalBLunaAmount }
}
const useValidators = ({ address }): UseValidatorsResult => {
  const client = useLCDClient();

  const { data: { delegations = [] } = {}, isFetched } = useDelegations({
    address,
  });

  const { data: validatorInfo } = useQuery({
    queryKey: ['validatorInfo'],
    queryFn: () => client?.staking.validators('migaloo-1'),
    enabled: Boolean(client),
  });
  const { data, isFetching } = useQuery({
    queryKey: ['validators', isFetched],
    queryFn: () => getValidators({ client,
      validatorInfo,
      delegations }),
    enabled: Boolean(client) && Boolean(validatorInfo) && Boolean(delegations),
  });
  const { data: stakedWhale } = useQuery({
    queryKey: ['stakedWhale'],
    queryFn: () => getStakedWhale({ client }),
    enabled: Boolean(client),
  })
  const { data: lunaLSTData } = useQuery({
    queryKey: ['stakedLSTs'],
    queryFn: () => getStakedLSTLunaAmounts({ client }),
    enabled: Boolean(client),
  })

  return {
    data: {
      validators: data?.validators || [],
      pagination: data?.pagination || {},
      stakedWhale: stakedWhale || 0,
      stakedAmpLuna: lunaLSTData?.totalAmpLunaAmount || 0,
      stakedBLuna: lunaLSTData?.totalBLunaAmount || 0,
    },
    isFetching,
  }
}
export default useValidators

import { useQuery } from 'react-query';

import { LCDClient } from '@terra-money/feather.js';
import useClient from 'hooks/useClient';
import usePrices from 'hooks/usePrices';
import tokens from 'public/mainnet/white_listed_alliance_token_info.json';
import { convertMicroDenomToDenom } from 'util/conversion';

interface Amount {
  amount: string;
  denom: string;
}
interface Message {
  amount: Amount
  validator_address: string;
  delegator_address: string;
}
interface Body {
  extension_options: any[]; // You may replace 'any' with a more specific type if needed
  memo: string;
  messages: Message[];
  non_critical_extension_options: any[]; // You may replace 'any' with a more specific type if needed
  timeout_height: string;
}
interface AuthInfo {
  signer_infos: any[]; // You may replace 'any' with a more specific type if needed
  fee: any
  tip: null
}
interface Tx {
  '@type': string;
  auth_info: AuthInfo;
  body: Body;
  signatures: string[];
}
interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: any[]; // You may replace 'any' with a more specific type if needed
  info: string;
  gas_wanted: string;
  gas_used: string;
  events: Event[];
  timestamp: string;
  tx: Tx
}
interface RawTxData {
  txs: any[];
  tx_responses: TxResponse[];
  pagination: null;
  total: string;
}

export interface Undelegation {
  amount: number;
  dollarValue: number;
  symbol: string;
  validatorAddress: string;
  delegatorAddress: string;
}
const getUndelegations = async (
  client: LCDClient | null,
  priceList: any,
  delegatorAddress: string,
): Promise<any> => {
  // This is the search params for gathering undelegations from alliance module
  const allianceParams = new URLSearchParams();
  // This is the search params for gathering undelegations from native module
  const nativeParams = new URLSearchParams();
  // For alliance we add their undelegate message action
  allianceParams.append('events',
    'message.action=\'/alliance.alliance.MsgUndelegate\'');
  // And same for native
  nativeParams.append('events',
    'message.action=\'/cosmos.staking.v1beta1.MsgUndelegate\'');
  // Next 3 params we can just add to both they are the same
  allianceParams.append('events',
    `coin_received.receiver='${delegatorAddress}'`);
  allianceParams.append('pagination.limit', '100');
  allianceParams.append('order_by', '2');

  nativeParams.append('events', `coin_received.receiver='${delegatorAddress}'`);
  nativeParams.append('pagination.limit', '100');
  nativeParams.append('order_by', '2');
  // Make the request for alliance undelegations
  const res = (await client?.alliance.
    getReqFromAddress(delegatorAddress).
    get('/cosmos/tx/v1beta1/txs', allianceParams)) as RawTxData;
  // Map the response to our undelegation object
  const undelegations: Undelegation[] = res.tx_responses.
    map((res) => res.tx.body.messages[0]).
    map((undelegation) => {
      const token = tokens.find((t) => t.denom === undelegation.amount.denom);
      const amount = convertMicroDenomToDenom(undelegation.amount.amount,
        token.decimals);
      const dollarValue = priceList[token.name] * amount;
      return {
        validatorAddress: undelegation.validator_address,
        delegatorAddress: undelegation.delegator_address,
        amount,
        dollarValue,
        symbol: token.symbol,
      };
    });
  // Do the same for native undelegations
  const nativeRes = (await client?.staking.
    getReqFromAddress(delegatorAddress).
    get('/cosmos/tx/v1beta1/txs', nativeParams)) as RawTxData;
  const nativeUndelegations: Undelegation[] = nativeRes.tx_responses.
    map((res) => res.tx.body.messages[0]).
    map((undelegation) => {
      const token = tokens.find((t) => t.denom === undelegation.amount.denom);
      const amount = convertMicroDenomToDenom(undelegation.amount.amount,
        token.decimals);
      const dollarValue = priceList[token.name] * amount;
      return {
        validatorAddress: undelegation.validator_address,
        delegatorAddress: undelegation.delegator_address,
        amount,
        dollarValue,
        symbol: token.symbol,
      };
    });
  // And finally merge them up and return
  const allUndelegations = undelegations.concat(nativeUndelegations);

  return { allUndelegations };
}

const useUndelegations = ({ address }) => {
  const client = useClient();
  const [priceList] = usePrices() || [];

  return useQuery({
    queryKey: ['undelegations', address],
    queryFn: () => getUndelegations(
      client, priceList, address,
    ),
    enabled: Boolean(address) && Boolean(priceList),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export default useUndelegations;

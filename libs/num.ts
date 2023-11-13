import BigNumber from 'bignumber.js';

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: [-10, 20],
});
export const num = (value: BigNumber.Value = '0'): BigNumber => new BigNumber(value);
